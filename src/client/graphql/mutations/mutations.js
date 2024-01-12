import gql from 'graphql-tag';

export const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!, $username: String!, $name: String!) {
    signUp(email: $email, password: $password, username: $username, name: $name) {
      email
    }
  }
`;

export const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    LogIn(email: $email, password: $password) {
      id
      name
      email
      username
      role
    }
  }
`;

export const LOG_OUT = gql`
  mutation LogOut {
    LogOut
  }
`;

export const VERIFY_LOGGED_IN = gql`
  mutation CheckIfLoggedIn {
    CheckIfLoggedIn {
      id
      name
      email
      username
      role
    }
  }
`;

export const CREATE_THEME = gql`
  mutation CreateTheme($name: String!, $path: String!) {
    createTheme(name: $name, path: $path) {
      name,
      path
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($userId: ID!, $themeId: ID!, $config: String!) {
    createCard(userId: $userId, themeId: $themeId, config: $config) {
      userId,
      themeId,
      config
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $config: String!) {
    updateCard(id: $id, config: $config) {
      id,
      config
    }
  }
`;

