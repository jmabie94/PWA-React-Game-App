import React from 'react';
import {
  BOARD_STATE,
  boardClass,
  emptyBoardLayout,
  shipLayout,
  moveToCoord,
  calculateOverhang,
  canBePlaced,
} from './BoardLogic';

export const PlayerBoard = ({
  currentlyPlacing,
  setCurrentlyPlacing,
  rotateShip,
  placeShip,
  placedShips,
  hitsByBot,
}) => {
  // Player ships on empty layout
  let layout = placedShips.reduce(
    (prevLayout, currentShip) =>
      shipLayout(prevLayout, currentShip, BOARD_STATE.ship),
    emptyBoardLayout()
  );

  // Hits by computer
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

  const isPlacingOverBoard = currentlyPlacing && currentlyPlacing.position != null;
  const canPlaceCurrentShip = isPlacingOverBoard && canBePlaced(currentlyPlacing, layout);

  if (isPlacingOverBoard) {
    if (canPlaceCurrentShip) {
      layout = shipLayout(layout, currentlyPlacing, BOARD_STATE.ship);
    } else {
      let forbiddenShip = {
        ...currentlyPlacing,
        length: currentlyPlacing.length - calculateOverhang(currentlyPlacing),
      };
      layout = shipLayout(layout, forbiddenShip, BOARD_STATE.forbidden);
    }
  }

  let squares = layout.map((square, index) => {
    return (
      <div
        onMouseDown={rotateShip}
        onClick={() => {
          if (canPlaceCurrentShip) {
            placeShip(currentlyPlacing);
          }
        }}
        className={`square ${boardClass[square]}`}
        key={`square-${index}`}
        id={`square-${index}`}
        onMouseOver={() => {
          if (currentlyPlacing) {
            setCurrentlyPlacing({
              ...currentlyPlacing,
              position: moveToCoord(index),
            });
          }
        }}
      />
    );
  });

  return (
    <div>
      <h2 className="player-title">You</h2>
      <div className="board">{squares}</div>
    </div>
  );
};