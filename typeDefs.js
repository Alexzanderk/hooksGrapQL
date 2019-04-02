const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        _id: ID
        name: String
        email: String
        picture: String
    }

    type Pin {
        _id: ID
        createdAt: String
        title: String
        content: String
        image: String
        latitude: Float
        longitude: Float
        author: User 
        comments: [Comment]
    }

    type Comment {
        _id: ID
        author: User
        text: String
        createdAt: String

    }

    type Query {
        me: User
    }
`
