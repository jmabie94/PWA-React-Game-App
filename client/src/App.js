import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import FormContainer from "./components/form/FormContainer";
import NavigationBar from "./components/lobby/Navigation";
// import TTT from './components/tictactoe/multiplayer/TicTacToe'; 
import Solo from './components/gamepage/mainpage'
import SoloTTT from './components/tictactoe/singleplayer/TicTacToe'
import SoloHangman from './components/hangman/singleplayer/hangman'
import SoloBattleship from './components/battleship/singleplayer/Battleship'
import React from 'react';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
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
            <Route path='/soloBattleship' element={<SoloBattleship />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
