import React from 'react';
import {
  boardClass,
  emptyBoardLayout,
  shipLayout,
  BOARD_STATE,
  moveToCoord,
  Sunked,
} from './BoardLogic';

export const BotBoard = ({
  botShips,
  gameState,
  hitsByPlayer,
  setHitsByPlayer,
  botsTurn,
  checkIfGameOver,
  setBotShips,
}) => {
  
  // ships on empty board
  let compLayout = botShips.reduce(
    (prevLayout, currentShip) =>
      shipLayout(prevLayout, currentShip, BOARD_STATE.ship),
    emptyBoardLayout()
  );

  //  Add hits dealt by player
  compLayout = hitsByPlayer.reduce(
    (prevLayout, currentHit) =>
      shipLayout(prevLayout, currentHit, currentHit.type),
    compLayout
  );

  compLayout = botShips.reduce(
    (prevLayout, currentShip) =>
      currentShip.sunk
        ? shipLayout(prevLayout, currentShip, BOARD_STATE.ship_sunk)
        : prevLayout,
    compLayout
  );

  // Check what's at the square and decide what next
  const sendHits = (index) => {
    if (compLayout[index] === 'ship') {
      const newHits = [
        ...hitsByPlayer,
        {
          position: moveToCoord(index),
          type: BOARD_STATE.hit,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    }
    if (compLayout[index] === 'empty') {
      const newHits = [
        ...hitsByPlayer,
        {
          position: moveToCoord(index),
          type: BOARD_STATE.miss,
        },
      ];
      setHitsByPlayer(newHits);
      return newHits;
    }
  };

  const playerTurn = gameState === 'player-turn';
  const playerCanFire = playerTurn && !checkIfGameOver();

  let alreadyHit = (index) =>
    compLayout[index] === 'hit' ||
    compLayout[index] === 'miss' ||
    compLayout[index] === 'ship-sunk';

  let compSquares = compLayout.map((square, index) => {
    return (
      <div
        // Only display square if it's a hit, miss, or sunk ship
        className={
          boardClass[square] === 'hit' ||
          boardClass[square] === 'miss' ||
          boardClass[square] === 'ship-sunk'
            ? `square ${boardClass[square]}`
            : `square`
        }
        key={`comp-square-${index}`}
        id={`comp-square-${index}`}
        onClick={() => {
          if (playerCanFire && !alreadyHit(index)) {
            const newHits = sendHits(index);
            const shipsWithSunkFlag = Sunked(newHits, botShips);
            const sunkShipsAfter = shipsWithSunkFlag.filter((ship) => ship.sunk).length;
            const sunkShipsBefore = botShips.filter((ship) => ship.sunk).length;
            if (sunkShipsAfter > sunkShipsBefore) {
            }
            setBotShips(shipsWithSunkFlag);
            botsTurn();
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">Bot</h2>
      <div className="board">{compSquares}</div>
    </div>
  );
};