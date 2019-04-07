import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import diffInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { Subscription } from 'react-apollo';

import Blog from './Blog';
import PinIcon from './PinIcon';
import { withStyles } from '@material-ui/core/styles';
import Context from '../context';

import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETED_PIN_MUTATION } from '../graphql/mutations';
import {
    PIN_ADDED_SUBSCRIPTION,
    PIN_DELETED_SUBSCRIPTION,
    PIN_UPDATED_SUBSCRIPTION
} from '../graphql/subscriptions';

const INITIAL_VIEWPORT = {
    latitude: 37.75,
    longitude: -122.4376,
    zoom: 13
};

const Map = ({ classes }) => {
    const client = useClient();

    const { state, dispatch } = useContext(Context);
    useEffect(() => {
        getPins();
    }, []);

    const [viewPort, setViewPort] = useState(INITIAL_VIEWPORT);
    const [userPosition, setUserPosition] = useState(null);
    useEffect(() => {
        getUserPosition();
    }, []);

    const [popup, setPopup] = useState(null);

    const getUserPosition = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                setViewPort({ ...viewPort, latitude, longitude });
                setUserPosition({ latitude, longitude });
            });
        }
    };

    const getPins = async () => {
        const { getPins } = await client.request(GET_PINS_QUERY);
        dispatch({ type: 'GET_PINS', payload: getPins });
    };

    const handleClickMap = ({ lngLat, leftButton }) => {
        if (!leftButton) return;
        if (!state.draft) {
            dispatch({ type: 'CREATE_DRAFT' });
        }
        const [longitude, latitude] = lngLat;
        dispatch({
            type: 'UPDATE_DRAFT_LOCATION',
            payload: { longitude, latitude }
        });
    };

    const highlightNewPin = pin => {
        const isNewPin = diffInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
        return isNewPin ? 'limegreen' : 'darkblue';
    };

    const handleSelectPin = pin => {
        setPopup(pin);
        dispatch({ type: 'SET_PIN', payload: pin });
    };

    const isAuthUser = () => state.currentUser._id === popup.author._id;

    const handleDeletePin = async pin => {
        const variables = { pinId: pin._id };
        await client.request(
            DELETED_PIN_MUTATION,
            variables
        );
        setPopup(null);
    };

    return (
        <div className={classes.root}>
            <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1IjoiYWxleHphbmRlcmsiLCJhIjoiY2pwZmdsOWZvMDl6ZDNrb3oxZDI4eGk5YSJ9.lGBFC7JtRiZ0xoIelnYgmA"
                width="100vw"
                height="calc(100vh - 64px)"
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={viewPort => setViewPort(viewPort)}
                onClick={handleClickMap}
                {...viewPort}>
                <div className={classes.navigationControl}>
                    <NavigationControl
                        onViewportChange={viewPort => setViewPort(viewPort)}
                    />
                </div>

                {/* pin for users current position */}

                {userPosition && (
                    <Marker
                        latitude={userPosition.latitude}
                        longitude={userPosition.longitude}
                        offsetLeft={-19}
                        offsetTop={-37}>
                        <PinIcon color="red" size={40} />
                    </Marker>
                )}

                {/* Draft pin */}

                {state.draft && (
                    <Marker
                        latitude={state.draft.latitude}
                        longitude={state.draft.longitude}
                        offsetLeft={-19}
                        offsetTop={-37}>
                        <PinIcon color="hotpink" size={40} />
                    </Marker>
                )}

                {/* Show all pins */}

                {state.pins.map(pin => (
                    <Marker
                        key={pin._id}
                        latitude={pin.latitude}
                        longitude={pin.longitude}
                        offsetLeft={-19}
                        offsetTop={-37}>
                        <PinIcon
                            onClick={() => handleSelectPin(pin)}
                            color={highlightNewPin(pin)}
                            size={40}
                        />
                    </Marker>
                ))}

                {/* Popup reated pin */}
                {popup && (
                    <Popup
                        anchor="top"
                        latitude={popup.latitude}
                        longitude={popup.longitude}
                        closeOnClick={false}
                        onClose={() => setPopup(null)}>
                        <img
                            className={classes.popupImage}
                            src={popup.image}
                            alt={popup.title}
                        />
                        <div className={classes.popupTab}>
                            <Typography>
                                {popup.latitude.toFixed(6)},{' '}
                                {popup.longitude.toFixed(6)}
                            </Typography>
                            {isAuthUser() && (
                                <Button onClick={() => handleDeletePin(popup)}>
                                    <DeleteIcon
                                        className={classes.deleteIcon}
                                    />
                                </Button>
                            )}
                        </div>
                    </Popup>
                )}
            </ReactMapGL>

            <Subscription
                subscription={PIN_ADDED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinAdded } = subscriptionData.data;
                    dispatch({type: "CREATE_PIN", payload: pinAdded})
                }}
            />
            <Subscription
                subscription={PIN_UPDATED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinUpdated } = subscriptionData.data;
                    console.log({pinUpdated})
                    dispatch({type: "CREATE_COMMENT", payload: pinUpdated})
                }}
            />
            <Subscription
                subscription={PIN_DELETED_SUBSCRIPTION}
                onSubscriptionData={({ subscriptionData }) => {
                    const { pinDeleted } = subscriptionData.data;
                    dispatch({type: "DELETE_PIN", payload: pinDeleted})
                }}
            />

            {/* Blog area */}

            <Blog />
        </div>
    );
};

const styles = {
    root: {
        display: 'flex'
    },
    rootMobile: {
        display: 'flex',
        flexDirection: 'column-reverse'
    },
    navigationControl: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '1em'
    },
    deleteIcon: {
        color: 'red'
    },
    popupImage: {
        padding: '0.4em',
        height: 200,
        width: 200,
        objectFit: 'cover'
    },
    popupTab: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    }
};

export default withStyles(styles)(Map);
