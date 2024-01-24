import { gql } from 'apollo-server-express';

export default gql`
  type Card {
    id: ID!
    userId: ID!
    themeId: ID!
    config: String!
    name: String
  }

  type CardForList {
    id: ID!
    userId: ID!
    themeId: ID
    themeName: String
    config: String
    name: String
  }

  extend type Query {
    publicCard(id: ID, name: String): Card @guest
    card(id: ID, name: String): Card @auth @hasRole
    cards: [CardForList!]! @auth @hasRole
  }

  extend type Mutation {
    createCard(userId: ID!, themeId: ID!, config: String!, name: String): Card @auth
    updateCard(id: ID!, userId: ID, themeId: ID, config: String!, name: String): Card @auth
    deleteCard(id: ID!): Card @auth
  }
`;
