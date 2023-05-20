import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormContainer from "./components/form/FormContainer";
import NavigationBar from "./components/lobby/Navigation";
// import TTT from './components/tictactoe/TicTacToe'; 
// import React, { useState } from 'react';



export default function App() {


  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<FormContainer />} />
        {/* <Route path="/tictactoe" element={<TTT />} /> */}
      </Routes>
    </Router>
  );
}