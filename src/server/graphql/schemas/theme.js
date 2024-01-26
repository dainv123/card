import { gql } from 'apollo-server-express';

export default gql`
  type Theme {
    id: ID!
    name: String!
    path: String!
    tags: [TagInfo]
    image: Image
  }

  type TagInfo {
    id: ID!
    name: String!
  }

  type Image {
    data: String!
    contentType: String!
  }

  input ImageInfo {
    data: String!
    contentType: String!
  }

  extend type Query {
    publicTheme(id: ID!): Theme @guest
    theme(id: ID!): Theme @auth @hasRole
    themes: [Theme!]! @auth @hasRole
  }

  extend type Mutation {
    createTheme(name: String!, path: String!, tags: [ID], image: ImageInfo): Theme @auth
    updateTheme(id: ID!, name: String!, path: String!, tags: [ID], image: ImageInfo): Theme @auth
    deleteTheme(id: ID!): Theme @auth
  }
`;
