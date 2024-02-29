import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './config/createApolloClient.js';
import configureStore, { history } from './config/configureStore.js';
import App from './App.js';

const store = configureStore();
const Root = () => {
  return (
    <Provider store={store}>
      <Router>
        <ApolloProvider client={client}>
          <App history={history} />
        </ApolloProvider>
      </Router>
    </Provider>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Root />, rootElement);
