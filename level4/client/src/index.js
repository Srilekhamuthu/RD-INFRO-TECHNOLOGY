import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter } from 'react-router-dom';

// GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:5000/graphql',
});

// Auth middleware to attach JWT token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',  // ✅ No "Bearer"
    }
  };
});

// Apollo Client setup
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Render React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
