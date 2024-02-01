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
  mutation CreateTheme($name: String!, $path: String!, $tags: [ID], $image: String!) {
    createTheme(name: $name, path: $path, tags: $tags, image: $image) {
      id
    }
  }
`;

export const UPDATE_THEME = gql`
  mutation UpdateTheme($id: ID!, $name: String!, $path: String!, $tags: [ID], $image: String!) {
    updateTheme(id: $id, name: $name, path: $path, tags: $tags, image: $image) {
      id
    }
  }
`;

export const DELETE_THEME = gql`
  mutation DeleteTheme($id: ID!) {
    deleteTheme(id: $id) {
      id
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CreateCard($userId: ID!, $themeId: ID!, $config: String!, $name: String) {
    createCard(userId: $userId, themeId: $themeId, config: $config, name: $name) {
      userId
      themeId
      config
      name
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $userId: ID, $themeId: ID, $config: String!, $name: String) {
    updateCard(id: $id, userId: $userId, themeId: $themeId, config: $config, name: $name) {
      id
      config
      name
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      id
    }
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($name: String!) {
    createTag(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: ID!, $name: String!) {
    updateTag(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      id
    }
  }
`;
export const CREATE_BLOG = gql`
  mutation CreateBlog($name: String!, $trend: String!, $introduction: String!, $content: String!, $image: String!) {
    createBlog(name: $name, trend: $trend, introduction: $introduction, content: $content, image: $image) {
      id
    }
  }
`;

export const UPDATE_BLOG = gql`
  mutation UpdateBlog($id: ID!, $name: String!, $trend: String!, $introduction: String!, $content: String!, $image: String!) {
    updateBlog(id: $id, name: $name, trend: $trend, introduction: $introduction, content: $content, image: $image) {
      id
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      id
    }
  }
`;