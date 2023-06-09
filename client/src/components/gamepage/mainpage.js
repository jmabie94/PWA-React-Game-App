import React from 'react';
import Card from './card';
import tictactoeImage from '../images/tictactoeImage.png';
import hangmanImage from '../images/hangmanImage.png';
import battleshipImage from '../images/battleshipImage.png';
import chessImage from '../images/chessImage.jpg';
import comingsoonImage from '../images/comingsoonImage.png';

const Online = () => {
  return (
    <div>
      <div className="container">
        <h1>Games</h1>
        <div className="card-container">
          <Card
            image={tictactoeImage}
            title="Tic Tac Toe"
            single="/SoloTTT"
            online="/PvPTTT"
          />
          <Card
            image={hangmanImage}
            title="Hang Man"
            single="/SoloHangman"
            online="/onlineHangman"
          />
          <Card
            image={battleshipImage}
            title="Battle Ship"
            single="/SoloBattleship"
            online="/onlineBattleship"
          />
          <Card
            image={chessImage}
            title="Chess"
            single="/SoloChess"
            online="/PvPChess"
          />
          <Card
            image={comingsoonImage}
            title="Coming Soon"
            single="/SoloCS"
            online="/onlineCS"
          />
        </div>
      </div>
    </div>
  );
};

export default Online;
