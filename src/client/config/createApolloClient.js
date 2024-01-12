import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  // uri: "mongodb://127.0.0.1:27017/invitation-cards",
  credentials: 'include',
  onError: ({ graphQLErrors, networkError, reponse }) => {
    // if (graphQLErrors) Response.errors = null;
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        // console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
});

export default client;
