import React from 'react';
import { Ships } from './Ships';
import { PlayerBoard } from './PlayerBoard';
import { BotBoard } from './BotBoard';
import './style.css';

export const CenterDisplay = ({
  hitsByPlayer,
  hitsByBot,
  playAgain,
  winner,
}) => {
  let playerHitPoints = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
  let botHitPoints = hitsByBot.filter((hit) => hit.type === 'hit').length;
  let winnerDisplay = (
    <div>
      <div className="battle-title">Game Ended!</div>
      <p className="center-display">
        {winner === 'player' ? 'You won!' : 'You Lost... '}
      </p>
      <button className="restart" onClick={playAgain}>
        Play Again!
      </button>
    </div>
  );

  let gameStarted = (
    <div>
      <div className="battle-title">Good Luck!</div>
      <div id="battle-start">
        <p className="center-display">Destroy all enemy ships!</p>
        <button className="restart" onClick={playAgain}>
          Go Back
        </button>
      </div>
    </div>
  );

  //first to 17points wins game
  return (
    <div id="if-win">
      {playerHitPoints === 17 || botHitPoints === 17
        ? winnerDisplay
        : gameStarted}
    </div>
  );
};


export const Board = ({
  availableShips,
  selectShip,
  currentlyPlacing,
  setCurrentlyPlacing,
  rotateShip,
  placeShip,
  placedShips,
  startGame,
  botShips,
  gameState,
  changeTurn,
  hitBot,
  hitsByPlayer,
  setHitsByPlayer,
  hitsByBot,
  botsTurn,
  checkIfGameOver,
  winner,
  playAgain,
  setBotShips,
}) => {
  return (
      <div className="hero-img">
      <br></br>
      <h2>BattleShips</h2>
      <section id="game-screen">
        <PlayerBoard
          currentlyPlacing={currentlyPlacing}
          setCurrentlyPlacing={setCurrentlyPlacing}
          rotateShip={rotateShip}
          placeShip={placeShip}
          placedShips={placedShips}
          hitsByBot={hitsByBot}
          />
        {gameState !== 'placement' ? (
          <CenterDisplay
          gameState={gameState}
          hitsByPlayer={hitsByPlayer}
          hitsByBot={hitsByBot}
          winner={winner}
          playAgain={playAgain}
          />
          ) : (
            <Ships
            availableShips={availableShips}
            selectShip={selectShip}
            currentlyPlacing={currentlyPlacing}
            startGame={startGame}
            playAgain={playAgain}
            />
            )}

        <BotBoard
          botShips={botShips}
          changeTurn={changeTurn}
          gameState={gameState}
          hitBot={hitBot}
          hitsByPlayer={hitsByPlayer}
          setHitsByPlayer={setHitsByPlayer}
          botsTurn={botsTurn}
          checkIfGameOver={checkIfGameOver}
          setBotShips={setBotShips}
          />
      </section>
    </div>
  );
};