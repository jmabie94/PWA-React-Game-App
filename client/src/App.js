import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormContainer from './components/form/FormContainer';
import NavigationBar from './components/lobby/Navigation';
import Profile from './components/profile/Profile';

// websocket for graphql subscriptions?
// import { WebSocketLink } from "@apollo/client/link/ws";
// import { getMainDefinition } from "@apollo/client/utilities";

// needs split for subscriptions
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

// original endpoint iteration
const httpLink = createHttpLink({
  uri: '/graphql',
});

// alternate approach to API endpoint link
// const localHttp = createHttpLink({
//   uri: 'http://localhost:4000/graphql',
// });

// const localWs = new WebSocketLink({
//   uri: 'ws://localhost:4000/graphql',
//   options: {
//     reconnect: true,
//   },
// });

// const local = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   localWs,
//   localHttp
// );
// supposedly this will better set up subscriptions?

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

// original iteration
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// alternate set up with local not httpLink
// const client = new ApolloClient({
//   link: authLink.concat(local),
//   cache: new InMemoryCache(),
// });

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
