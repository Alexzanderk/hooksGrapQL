import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { BASE_URL } from '../../client';
import { ME_QUERY } from '../../graphql/queries';

import Contex from '../../context';

const Login = ({ classes }) => {
    const { dispatch } = useContext(Contex);

    const onSuccess = async googleUser => {
        try {
            const idToken = googleUser.getAuthResponse().id_token;
            const client = new GraphQLClient(BASE_URL, {
                headers: {
                    authorization: idToken
                }
            });
            const { me } = await client.request(ME_QUERY);
            dispatch({ type: 'LOGIN_USER', payload: me });
            dispatch({
                type: 'IS_LOGGED_IN',
                payload: googleUser.isSignedIn()
            });
        } catch (error) {
            onFailure(error);
        }
    };

    const onFailure = err => {
        console.error('Error loggin in', err)
        dispatch({
            type: 'IS_LOGGED_IN',
            payload: false
        });
    };

    return (
        <div className={classes.root}>
            <Typography
                component="h1"
                variant="h3"
                gutterBottom
                noWrap
                style={{
                    color: 'rgb(66, 133, 244)'
                }}>
                Welcome
            </Typography>
            <GoogleLogin
                clientId="616300225060-rnr9bpeu1m9lu95lea6iii4l5tgup11l.apps.googleusercontent.com"
                onSuccess={onSuccess}
                onFailure={onFailure}
                isSignedIn={true}
                buttonText="Loggin with Google"
                theme="dark"
            />
        </div>
    );
};

const styles = {
    root: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }
};

export default withStyles(styles)(Login);
