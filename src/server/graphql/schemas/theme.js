import { gql } from 'apollo-server-express';

export default gql`
  type Theme {
    id: ID!
    name: String!
    path: String!
  }

  extend type Query {
    publicTheme(id: ID!): Theme @guest
    theme(id: ID!): Theme @auth @hasRole(role: USER)
    themes: [Theme!]! @auth @hasRole(role: USER)
  }

  extend type Mutation {
    createTheme(name: String!, path: String!): Theme @auth
    updateTheme(id: ID!, name: String!, path: String!): Theme @auth
    deleteTheme(id: ID!): Theme @auth
  }
`;
