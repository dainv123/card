import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID!
    email: String!
    username: String!
    name: String!
    role: String!
    isVerified: Boolean
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    user(id: ID!): User @auth @hasRole(role: ADMIN)
    users: [User!]! @auth @hasRole(role: ADMIN)
  }

  extend type Mutation {
    signUp(email: String!, username: String!, name: String!, password: String!): User @guest
    updateUser(email: String!, username: String!, name: String!): Boolean @auth
    resendSignUpToken(email: String!): Boolean @guest
    verifyUser(token: String!): Boolean @guest
    sendContact(name: String!, email: String!, message: String!): Boolean
    LogIn(email: String!, password: String!): User @guest
    CheckIfLoggedIn: User @auth
    LogOut: Boolean @auth
    ChangePassword(password: String!, newPassword: String!): Boolean @auth
    ChangePasswordWithToken(newPassword: String!, token: String!): Boolean @guest
    forgotPassword(email: String!): Boolean @guest
  }
`;
