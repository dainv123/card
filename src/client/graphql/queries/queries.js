import gql from 'graphql-tag';

export const GET_THEME = gql`
    query GetTheme($id: ID!) {
        theme(id: $id) {
            id
            name
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

