const user = {
    _id: '1',
    name: 'Alex',
    email: 'alex@test.com',
    picture: 'https://cloudinary.com/adw'
}

module.exports = {
    Query: {
        me: () => user
    }
}