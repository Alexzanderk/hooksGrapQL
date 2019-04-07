export const CREATE_PIN_MUTATION = `
    mutation($title: String!, $image: String!, $content: String!, $latitude: Float!, $longitude: Float!) {
        createPin(input: {
            title: $title,
            image: $image,
            content: $content,
            latitude: $latitude,
            longitude: $longitude
        }) {
            _id
            title
            image
            content
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
        }
    }
`;

export const DELETED_PIN_MUTATION = `
    mutation($pinId: ID!) {
        deletePin(pinId: $pinId) {
            _id
        }
    }
`;