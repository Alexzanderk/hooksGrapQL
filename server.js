const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/userController');

require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null;
        let currentUser = null;

        try {
            authToken = req && req.headers && req.headers.authorization;

            if (authToken) {
                // if auth token find or create user
                currentUser = await findOrCreateUser(authToken);
            }
        } catch (error) {
            console.error(error);
        }

        return { currentUser };
    }
});

server.listen().then(({ url }) => console.log(url));
