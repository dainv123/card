import gql from 'graphql-tag';

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
    }
  }
`;

export const GET_PUBLIC_THEME = gql`
  query GetPublicTheme($id: ID!) {
    publicTheme(id: $id) {
      id
      name
      path
      tags {
        id
        name
      }
      image {
        data
        contentType
      }
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
      image {
        data
        contentType
      }
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

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
    }
  }
`;