import gql from 'graphql-tag';

export const GET_THEME = gql`
  query GetTheme($id: ID!) {
    theme(id: $id) {
      id
      name
      path
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

export const GET_THEMES = gql`
  query GetThemes {
    themes {
      id
      name
      path
    }
  }
`;

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
      id
      userId
      themeId
      config
    }
  }
`;

export const GET_PUBLIC_CARD = gql`
  query GetPublicCard($id: ID!) {
    publicCard(id: $id) {
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
    }
  }
`;
