import React from 'react';
import { ShipBox } from './ShipBox';

export const Ships = ({
  availableShips,
  selectShip,
  currentlyPlacing,
  startGame,
  playAgain,
}) => {
  let shipsLeft = availableShips.map((ship) => ship.name);

  // returns shipBox & length that are not used
  let shipBoxes = shipsLeft.map((shipName) => (
    <ShipBox
      selectShip={selectShip}
      key={shipName}
      isCurrentlyPlacing={currentlyPlacing && currentlyPlacing.name === shipName}
      shipName={shipName}
      availableShips={availableShips}
    />
  ));

  let placeShip = (
    <div id="place-ship">
        <p>Click a ship and place</p>
        <p>on your board.</p>
      {shipBoxes}
      <p className="center-display">Right click to rotate!</p>
      <button className="restart" onClick={playAgain}>
        Reset
      </button>
    </div>
  );

  let readyStart = (
    <div id="play-ready">
      <p className="center-display">All ships are placed!</p>
      <button id="play-button" onClick={startGame}>
        Start game
      </button>
    </div>
  );

  return (
    <div id="available-ships">
      <div className="battle-title"> Get Ready! </div>
      {availableShips.length > 0 ? placeShip : readyStart}
    </div>
  );
};