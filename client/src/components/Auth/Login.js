import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from '@material-ui/core/styles';
// import Typography from "@material-ui/core/Typography";

import Contex from '../../context';

const ME_QUERY = `
  {
    me {
    name,
    email
    picture
    }
  }
`;

const Login = ({ classes }) => {
    const { dispatch } = useContext(Contex);

    const onSuccess = async googleUser => {
        const idToken = googleUser.getAuthResponse().id_token;
        const client = new GraphQLClient('http://localhost:4000/graphql', {
            headers: {
                authorization: idToken
            }
        });
        const data = await client.request(ME_QUERY);
        dispatch({ type: 'LOGIN_USER', payload: data.me });
    };

    return (
        <GoogleLogin
            clientId="616300225060-rnr9bpeu1m9lu95lea6iii4l5tgup11l.apps.googleusercontent.com"
            onSuccess={onSuccess}
            isSignedIn={true}
        />
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
