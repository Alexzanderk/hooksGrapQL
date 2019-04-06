export const ME_QUERY = `
{
  me {
  name,
  email
  picture
  }
}
`;

export const GET_PINS_QUERY = `
  {
    getPins {
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
      comments {
        text
        createdAt
        author {
          _id
          name
          email
          picture
        }
      }
    }
  }
`