const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const verifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verify auth token', error);
    }
};

const checkIfUserExist = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
    const { name, email, picture } = googleUser;
    const user = { name, email, picture };
    return new User(user).save();
};

exports.findOrCreateUser = async token => {
    const googleUser = await verifyAuthToken(token);
    console.log(googleUser);
    const user = await checkIfUserExist(googleUser.email);
    return user ? user : createNewUser(googleUser);
};
