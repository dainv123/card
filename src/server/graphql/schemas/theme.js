import { gql } from 'apollo-server-express';

export default gql`
  type Theme {
    id: ID!
    name: String!
    path: String!
    tags: [TagInfo]
  }

  type TagInfo {
    id: ID!
    name: String!
  }

  extend type Query {
    publicTheme(id: ID!): Theme @guest
    theme(id: ID!): Theme @auth @hasRole(role: USER)
    themes: [Theme!]! @auth @hasRole(role: USER)
  }

  extend type Mutation {
    createTheme(name: String!, path: String!, tags: [ID]): Theme @auth
    updateTheme(id: ID!, name: String!, path: String!, tags: [ID]): Theme @auth
    deleteTheme(id: ID!): Theme @auth
  }
`;
