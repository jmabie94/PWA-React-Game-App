export const BOARD_ROWS = 10;
export const BOARD_COLUMNS = 10;
export const BOARD = BOARD_COLUMNS * BOARD_ROWS;

export const BOARD_STATE = {
  empty: 'empty',
  ship: 'ship',
  hit: 'hit',
  miss: 'miss',
  ship_sunk: 'ship-sunk',
  forbidden: 'forbidden',
  awaiting: 'awaiting',
};

export const boardClass = {
  [BOARD_STATE.empty]: 'empty',
  [BOARD_STATE.ship]: 'ship',
  [BOARD_STATE.hit]: 'hit',
  [BOARD_STATE.miss]: 'miss',
  [BOARD_STATE.ship_sunk]: 'ship-sunk',
  [BOARD_STATE.forbidden]: 'forbidden',
  [BOARD_STATE.awaiting]: 'awaiting',
};

// Returns an empty board
export const emptyBoardLayout = () => {
  return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(BOARD_STATE.empty);
};


export const coordsToIndex = (coordinates) => {
  const { x, y } = coordinates;

  return y * BOARD_ROWS + x;
};

export const moveToCoord = (index) => {
  return {
    x: index % BOARD_ROWS,
    y: Math.floor(index / BOARD_ROWS),
  };
};

export const entityIndices = (entity) => {
  let position = coordsToIndex(entity.position);

  let indices = [];

  for (let i = 0; i < entity.length; i++) {
    indices.push(position);
    position = entity.orientation === 'vertical' ? position + BOARD_ROWS : position + 1;
  }

  return indices;
};

// Alternative take
export const entityIndices2 = (entity) => {
  let indices = [];
  for (let i = 0; i < entity.length; i++) {
    const position =
      entity.orientation === 'vertical'
        ? coordsToIndex({ y: entity.position.y + i, x: entity.position.x })
        : coordsToIndex({ y: entity.position.y, x: entity.position.x + i });
    indices.push(position);
  }

  return indices;
};

//stay within bounds
export const isWithinBounds = (entity) => {
  return (
    (entity.orientation === 'vertical' &&
      entity.position.y + entity.length <= BOARD_ROWS) ||
    (entity.orientation === 'horizontal' &&
      entity.position.x + entity.length <= BOARD_COLUMNS)
  );
};

// place ships on board
export const shipLayout = (oldLayout, entity, type) => {
  let newLayout = oldLayout.slice();

  if (type === 'ship') {
    entityIndices(entity).forEach((idx) => {
      newLayout[idx] = BOARD_STATE.ship;
    });
  }

  if (type === 'forbidden') {
    entityIndices(entity).forEach((idx) => {
      newLayout[idx] = BOARD_STATE.forbidden;
    });
  }

  if (type === 'hit') {
    newLayout[coordsToIndex(entity.position)] = BOARD_STATE.hit;
  }

  if (type === 'miss') {
    newLayout[coordsToIndex(entity.position)] = BOARD_STATE.miss;
  }

  if (type === 'ship-sunk') {
    entityIndices(entity).forEach((idx) => {
      newLayout[idx] = BOARD_STATE.ship_sunk;
    });
  }

  return newLayout;
};

// checking if squares are free
export const isPlaceFree = (entity, layout) => {
  let shipIndices = entityIndices2(entity);

  return shipIndices.every((idx) => layout[idx] === BOARD_STATE.empty);
};

// checks if ships in bound
export const calculateOverhang = (entity) =>
  Math.max(
    entity.orientation === 'vertical'
      ? entity.position.y + entity.length - BOARD_ROWS
      : entity.position.x + entity.length - BOARD_COLUMNS,
    0
  );

// checks if within bound, and square is empty
export const canBePlaced = (entity, layout) =>
  isWithinBounds(entity) && isPlaceFree(entity, layout);

// random ship placement generated 
export const placeAllBotShips = (botShips) => {
  let compLayout = emptyBoardLayout();

  return botShips.map((ship) => {
    while (true) {
      let decoratedShip = randomizeShipProps(ship);

      if (canBePlaced(decoratedShip, compLayout)) {
        compLayout = shipLayout(compLayout, decoratedShip, BOARD_STATE.ship);
        return { ...decoratedShip, placed: true };
      }
    }
  });
};

export const generateRandomOrientation = () => {
  let randomNumber = Math.floor(Math.random() * Math.floor(2));

  return randomNumber === 1 ? 'vertical' : 'horizontal';
};

export const generateRandomIndex = (value = BOARD) => {
  return Math.floor(Math.random() * Math.floor(value));
};

export const randomizeShipProps = (ship) => {
  let randomStartIndex = generateRandomIndex();

  return {
    ...ship,
    position: moveToCoord(randomStartIndex),
    orientation: generateRandomOrientation(),
  };
};


export const placeCompShipInLayout = (ship, compLayout) => {
  let newCompLayout = compLayout.slice();

  entityIndices2(ship).forEach((idx) => {
    newCompLayout[idx] = BOARD_STATE.ship;
  });
  return newCompLayout;
};

// Logic to find nearby targets
export const getNearby = (coords) => {
  let firstRow = coords.y === 0;
  let lastRow = coords.y === 9;
  let firstColumn = coords.x === 0;
  let lastColumn = coords.x === 9;

  let neighbors = [];


  if (firstRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y + 1 }
    );
  }

  if (lastRow) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y },
      { x: coords.x - 1, y: coords.y },
      { x: coords.x, y: coords.y - 1 }
    );
  }
  
  if (firstColumn) {
    neighbors.push(
      { x: coords.x + 1, y: coords.y }, 
      { x: coords.x, y: coords.y + 1 }, 
      { x: coords.x, y: coords.y - 1 } 
    );
  }

  if (lastColumn) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, 
      { x: coords.x, y: coords.y + 1 }, 
      { x: coords.x, y: coords.y - 1 } 
    );
  }

  if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
    neighbors.push(
      { x: coords.x - 1, y: coords.y }, 
      { x: coords.x + 1, y: coords.y }, 
      { x: coords.x, y: coords.y - 1 }, 
      { x: coords.x, y: coords.y + 1 } 
    );
  }

  let filteredResult = [
    ...new Set(
      neighbors
        .map((coords) => coordsToIndex(coords))
        .filter((number) => number >= 0 && number < BOARD)
    ),
  ];

  return filteredResult;
};

// updates sunked ships 
export const Sunked = (currentHits, opponentShips) => {
  let playerHitIndices = currentHits.map((hit) => coordsToIndex(hit.position));

  let indexWasHit = (index) => playerHitIndices.includes(index);

  let shipsWithSunkFlag = opponentShips.map((ship) => {
    let shipIndices = entityIndices2(ship);
    if (shipIndices.every((idx) => indexWasHit(idx))) {
      return { ...ship, sunk: true };
    } else {
      return { ...ship, sunk: false };
    }
  });

  return shipsWithSunkFlag;
};