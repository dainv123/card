import { gql } from 'apollo-server-express';

export default gql`
  type Theme {
    id: ID!
    name: String!
    path: String!
  }

  extend type Query {
    theme(id: ID!): Theme @auth @hasRole(role: USER)
    themes: [Theme!]! @auth @hasRole(role: USER)
  }

  extend type Mutation {
    createTheme(name: String!, path: String!): Theme @auth
  }
`;
