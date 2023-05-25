import React, { useState } from 'react';
import { Board } from './Board';
import {
  placeAllBotShips,
  BOARD_STATE,
  moveToCoord,
  shipLayout,
  emptyBoardLayout,
  generateRandomIndex,
  getNearby,
  Sunked,
  coordsToIndex,
} from './BoardLogic';
import './style.css';

const battleShips = [
  {
    name: 'carrier',
    length: 5,
    placed: null,
  },
  {
    name: 'battleship',
    length: 4,
    placed: null,
  },
  {
    name: 'cruiser',
    length: 3,
    placed: null,
  },
  {
    name: 'submarine',
    length: 3,
    placed: null,
  },
  {
    name: 'destroyer',
    length: 2,
    placed: null,
  },
];

export default function SoloBattleship() {
  const [gameState, setGameState] = useState('placement');
  const [winner, setWinner] = useState(null);
  const [currentlyPlacing, setCurrentlyPlacing] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(battleShips);
  const [botShips, setBotShips] = useState([]);
  const [hitsByPlayer, setHitsByPlayer] = useState([]);
  const [hitsByBot, setHitsByBot] = useState([]);

  // ------------Player Logic----------------
  const selectShip = (shipName) => {
    let shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
    const shipToPlace = availableShips[shipIdx];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: 'horizontal',
      position: null,
    });
  };

  const placeShip = (currentlyPlacing) => {
    setPlacedShips([
      ...placedShips,
      {
        ...currentlyPlacing,
        placed: true,
      },
    ]);

    setAvailableShips((previousShips) =>
      previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
    );

    setCurrentlyPlacing(null);
  };

  const rotateShip = (event) => {
    if (currentlyPlacing != null && event.button === 2) {
      setCurrentlyPlacing({
        ...currentlyPlacing,
        orientation:
          currentlyPlacing.orientation === 'vertical' ? 'horizontal' : 'vertical',
      });
    }
  };

  const startGame = () => {
    genBotShips();
    setGameState('player-turn');
  };

  const changeTurn = () => {
    setGameState((oldGameState) =>
      oldGameState === 'player-turn' ? 'bot-turn' : 'player-turn'
    );
  };

  // ------------Bot Logic----------------
  const genBotShips = () => {
    let placedBotShips = placeAllBotShips(battleShips.slice());
    setBotShips(placedBotShips);
  };

  const botHitting = (index, layout) => {
    let botHits;

    if (layout[index] === 'ship') {
      botHits = [
        ...hitsByBot,
        {
          position: moveToCoord(index),
          type: BOARD_STATE.hit,
        },
      ];
    }
    if (layout[index] === 'empty') {
      botHits = [
        ...hitsByBot,
        {
          position: moveToCoord(index),
          type: BOARD_STATE.miss,
        },
      ];
    }
    const sunkShips = Sunked(botHits, placedShips);
    const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
    const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;
    if (sunkShipsAfter > sunkShipsBefore) {
    }
    setPlacedShips(sunkShips);
    setHitsByBot(botHits);
  };

  // bots turn then checks if game is over
  const botsTurn = () => {
    changeTurn();

    if (checkIfGameOver()) {
      return;
    }

    // Recreate layout to get eligible squares
    let layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        shipLayout(prevLayout, currentShip, BOARD_STATE.ship),
      emptyBoardLayout()
    );

    layout = hitsByBot.reduce(
      (prevLayout, currentHit) =>
        shipLayout(prevLayout, currentHit, currentHit.type),
      layout
    );

    layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        currentShip.sunk
          ? shipLayout(prevLayout, currentShip, BOARD_STATE.ship_sunk)
          : prevLayout,
      layout
    );

    let successfulbotHits = hitsByBot.filter((hit) => hit.type === 'hit');

    let nonSunkbotHits = successfulbotHits.filter((hit) => {
      const hitIndex = coordsToIndex(hit.position);
      return layout[hitIndex] === 'hit';
    });

    let potentialTargets = nonSunkbotHits
      .flatMap((hit) => getNearby(hit.position))
      .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

    // Until there's a successful hit
    if (potentialTargets.length === 0) {
      let layoutIndices = layout.map((item, idx) => idx);
      potentialTargets = layoutIndices.filter(
        (index) => layout[index] === 'ship' || layout[index] === 'empty'
      );
    }

    let randomIndex = generateRandomIndex(potentialTargets.length);

    let target = potentialTargets[randomIndex];

    setTimeout(() => {
      botHitting(target, layout);
      changeTurn();
    }, 300);
  };

  // *** END GAME ***

  // Check if either player or bot ended the game
  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let successfulbotHits = hitsByBot.filter((hit) => hit.type === 'hit')
      .length;

    if (successfulbotHits === 17 || successfulPlayerHits === 17) {
      setGameState('game-over');

      if (successfulbotHits === 17) {
        setWinner('bot');
      }
      if (successfulPlayerHits === 17) {
        setWinner('player');
      }

      return true;
    }

    return false;
  };

  const playAgain = () => {
    setGameState('placement');
    setWinner(null);
    setCurrentlyPlacing(null);
    setPlacedShips([]);
    setAvailableShips(battleShips);
    setBotShips([]);
    setHitsByPlayer([]);
    setHitsByBot([]);
  };


  return (
    <Board
      availableShips={availableShips}
      selectShip={selectShip}
      currentlyPlacing={currentlyPlacing}
      setCurrentlyPlacing={setCurrentlyPlacing}
      rotateShip={rotateShip}
      placeShip={placeShip}
      placedShips={placedShips}
      startGame={startGame}
      botShips={botShips}
      gameState={gameState}
      changeTurn={changeTurn}
      hitsByPlayer={hitsByPlayer}
      setHitsByPlayer={setHitsByPlayer}
      hitsByBot={hitsByBot}
      setHitsByBot={setHitsByBot}
      botsTurn={botsTurn}
      checkIfGameOver={checkIfGameOver}
      playAgain={playAgain}
      winner={winner}
      setBotShips={setBotShips}
    />
  );
};

