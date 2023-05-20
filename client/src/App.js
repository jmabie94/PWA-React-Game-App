import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormContainer from './components/form/FormContainer';
import NavigationBar from './components/lobby/Navigation';
import Profile from './components/profile/Profile';
// import TTT from './components/tictactoe/TicTacToe';
// import React, { useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// integrating GraphQL ApolloClient
// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<FormContainer />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/tictactoe" element={<TTT />} /> */}
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
