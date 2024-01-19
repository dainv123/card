import { gql } from 'apollo-server-express';

export default gql`
  type Card {
    id: ID!
    userId: ID!
    themeId: ID!
    config: String!
    name: String
  }

  type CardDetail {
    id: ID!
    userId: ID!
    themeId: ID!
    themeName: String!
    config: String!
    name: String
  }

  extend type Query {
    publicCard(id: ID!): Card @guest
    card(id: ID!): Card @auth @hasRole(role: USER)
    cards: [CardDetail!]! @auth @hasRole(role: USER)
  }

  extend type Mutation {
    createCard(userId: ID!, themeId: ID!, config: String!, name: String): Card @auth
    updateCard(id: ID!, userId: ID, themeId: ID, config: String!, name: String): Card @auth
    deleteCard(id: ID!): Card @auth
  }
`;
