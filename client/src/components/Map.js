import React, { useState } from 'react';
import ReactMapGL, { NavigationControl } from 'react-map-gl';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';

const INITIAL_VIEWPORT = {
    latitude: 37.75,
    longitude: -122.4376,
    zoom: 13
};

const Map = ({ classes }) => {
    const [viewPort, setViewPort] = useState(INITIAL_VIEWPORT);
    return (
        <div className={classes.root}>
            <ReactMapGL
                mapboxApiAccessToken="pk.eyJ1IjoiYWxleHphbmRlcmsiLCJhIjoiY2pwZmdsOWZvMDl6ZDNrb3oxZDI4eGk5YSJ9.lGBFC7JtRiZ0xoIelnYgmA"
                width="100vw"
                height="calc(100vh - 64px)"
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={viewPort => setViewPort(viewPort)}
                {...viewPort}>
                <div className={classes.navigationControl}>
                    <NavigationControl
                        onViewportChange={viewPort => setViewPort(viewPort)}
                    />
                </div>
            </ReactMapGL>
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
