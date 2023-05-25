// taking the reformatted Chessboard.js and trying to use the attempt at two-player logic for TicTacToe to create a two-player logic set up for Chess
// removed the rightClicked stuff from single player cause it seemed overly complicated and unnecessary to implement here

import React, { useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import './pvp.css';
import Header from './headerPvP';
import Chess from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessGamePvP = () => {
// need to refactor from scratch once I have solo working
};

export default ChessGamePvP;
