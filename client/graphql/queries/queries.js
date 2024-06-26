import gql from 'graphql-tag';

export const GET_IMAGE = gql`
  query GetImage($id: ID!) {
    image(id: $id) {
      id
      image
    }
  }
`;


export const GET_IMAGES = gql`
  query GetImages {
    images {
      id
      image
    }
  }
`;


export const GET_THEME = gql`
  query GetTheme($id: ID!) {
    theme(id: $id) {
      id
      name
      path
      tags {
        id
        name
      }
      image
    }
  }
`;

export const GET_PUBLIC_THEME = gql`
  query GetPublicTheme($id: ID!) {
    publicTheme(id: $id) {
      id
      name
      path
    }
  }
`;

export const GET_PUBLIC_THEMES = gql`
  query GetPublicThemes {
    publicThemes {
      id
      name
      path
      tags {
        id
        name
      }
      image
    }
  }
`;

export const GET_THEMES = gql`
  query GetThemes {
    themes {
      id
      name
      path
      tags {
        id
        name
      }
      image
    }
  }
`;

export const GET_CARD = gql`
  query GetCard($id: ID, $name: String) {
    card(id: $id, name: $name) {
      id
      userId
      themeId
      config
      name
    }
  }
`;

export const GET_PUBLIC_CARD = gql`
  query GetPublicCard($id: ID, $name: String) {
    publicCard(id: $id, name: $name) {
      id
      userId
      themeId
      config
    }
  }
`;

export const GET_CARDS = gql`
  query GetCards {
    cards {
      id
      userId
      themeId
      themeName
      config
      name
    }
  }
`;

export const GET_TAG = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
      id
      name
    }
  }
`;

export const GET_PUBLIC_TAGS = gql`
  query GetPublicTags {
    publicTags {
      id
      name
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;

export const GET_BLOG = gql`
  query GetBlog($id: ID, $name: String) {
    blog(id: $id, name: $name) {
      id
      name
      trend
      introduction
      content
      image
      updatedAt
    }
  }
`;

export const GET_PUBLIC_BLOG = gql`
  query GetPublicBlog($id: ID, $name: String) {
    publicBlog(id: $id, name: $name) {
      id
      name
      trend
      introduction
      content
      image
      updatedAt
    }
  }
`;

export const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      id
      name
      trend
      introduction
      content
      image
      updatedAt
    }
  }
`;

export const GET_PUBLIC_BLOGS = gql`
  query GetPublicBlogs {
    publicBlogs {
      id
      name
      trend
      introduction
      content
      image
      updatedAt
    }
  }
`;
