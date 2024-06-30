import { gql } from 'apollo-server-express';

export default gql`
  type Blog {
    id: ID!
    name: String!
    trend: String
    introduction: String
    content: String
    image: String
    updatedAt: String
  }

  extend type Query {
    publicBlog(id: ID, name: String): Blog @guest
    blog(id: ID, name: String): Blog @auth @hasRole
    publicBlogs: [Blog!]! @guest
    blogs: [Blog!]! @auth @hasRole
  }

  extend type Mutation {
    createBlog(
      name: String!
      trend: String!
      introduction: String!
      content: String!
      image: String
    ): Blog @auth
    updateBlog(
      id: ID!
      name: String!
      trend: String!
      introduction: String!
      content: String!
      image: String
    ): Blog @auth
    deleteBlog(id: ID!): Blog @auth
  }
`;
