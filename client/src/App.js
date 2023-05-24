import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormContainer from "./components/form/FormContainer";
import NavigationBar from "./components/lobby/Navigation";
import ChatWindow from "./components/lobby/Chat"
import Solo from './components/gamepage/mainpage'
import SoloTTT from './components/tictactoe/singleplayer/TicTacToe'
import SoloHangman from './components/hangman/singleplayer/hangman'
import Profile from './components/profile/Profile';
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
            <Route path="/games" element={<Solo />} />
            <Route path="/soloTTT" element={<SoloTTT />} />
            {/* <Route path="/onlineTTT" element={<TTT />} /> */}
            <Route path='/soloHangman' element={<SoloHangman />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
        <ChatWindow />
      </Router>
    </ApolloProvider>
  );
}
