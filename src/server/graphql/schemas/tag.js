import { gql } from 'apollo-server-express';

export default gql`
  type Tag {
    id: ID!
    name: String!
  }

  extend type Query {
    publicTag(id: ID!): Tag @guest
    tag(id: ID!): Tag @auth @hasRole(role: ADMIN)
    tags: [Tag!]! @auth @hasRole(role: ADMIN)
  }

  extend type Mutation {
    createTag(name: String!): Tag @auth
    updateTag(id: ID!, name: String!): Tag @auth
    deleteTag(id: ID!): Tag @auth
  }
`;
