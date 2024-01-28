import { gql } from 'apollo-server-express';

export default gql`
  type TagInfo {
    id: ID!
    name: String!
  }

  type Theme {
    id: ID!
    name: String!
    path: String!
    tags: [TagInfo]
    image: String!
  }

  extend type Query {
    publicTheme(id: ID!): Theme @guest
    theme(id: ID!): Theme @auth @hasRole
    themes: [Theme!]! @auth @hasRole
  }

  extend type Mutation {
    createTheme(name: String!, path: String!, tags: [ID], image: Upload!): Theme @auth
    updateTheme(id: ID!, name: String!, path: String!, tags: [ID], image: Upload!): Theme @auth
    deleteTheme(id: ID!): Theme @auth
  }
`;
