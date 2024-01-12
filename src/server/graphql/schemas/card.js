import { gql } from 'apollo-server-express';

export default gql`
  type Card {
    id: ID!
    userId: String!
    themeId: String!
    config: String!
  }

  extend type Query {
    card(id: ID!): Card @auth @hasRole(role: USER)
    cards: [Card!]! @auth @hasRole(role: USER)
  }

  extend type Mutation {
    createCard(userId: ID!, themeId: ID!, config: String!): Card @auth
    updateCard(id: ID!, config: String!): Card @auth
  }
`;
