import React from 'react';


export const ShipBox = ({
    shipName,
    selectShip,
    availableShips,
    isCurrentlyPlacing,
  }) => {
    let ship = availableShips.find((item) => item.name === shipName);
    let shipLength = new Array(ship.length).fill('ship');
    let allboxedShipsSquares = shipLength.map((item, index) => (
      <div className="sm-square" key={index} />
    ));
  
    return (
      <div
        id={`${shipName}-boxedShips`}
        onClick={() => selectShip(shipName)}
        key={`${shipName}`}
        className={isCurrentlyPlacing ? 'boxedShips placing' : 'boxedShips'}
      >
        <div className="boxedShips-title">{shipName}</div>
        <div className="boxedShips-squares">{allboxedShipsSquares}</div>
      </div>
    );
  };
