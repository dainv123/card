import { gql } from 'apollo-server-express';

export default gql`
  type Image {
    id: ID!
    userId: ID!
    image: String!
  }

  extend type Query {
    image(id: ID!): Image @auth @hasRole
    images: [Image!]! @auth @hasRole
  }

  extend type Mutation {
    createImage(userId: ID!, image: String!): Image @auth
    updateImage(id: ID!, userId: ID!, image: String!): Image @auth
    deleteImage(id: ID!): Image @auth
  }
`;
