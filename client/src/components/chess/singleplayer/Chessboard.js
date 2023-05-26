// Chessboard using react-chessboard
// this iteration of the starting logic is under the "Click To Move" demo provided by the react-chessboard npm documents
// going to need a refactored version which makes the game two player for the ChessboardPvP file
// missing functionality to announce victory and which user has won, also missing warning for players in checkmate

import React, { useState } from 'react';
import './solo.css';
import Header from './header';
import Chess from 'chess.js';
import { Chessboard } from 'react-chessboard';

// Refactor from scratch!
// use localstorage or put/get to graphql to register wins and losses
const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [playerTurn, setPlayerTurn] = useState('white');
  const [winner, setWinner] = useState('');

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    // if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
    if (game.game_over() && winner === '') {
      setWinner('white');
      console.log('winner = ', winner);
      return;
    } else if (game.in_draw() && winner === '') {
      setWinner('draw');
      return;
    } else if (possibleMoves.length === 0 && winner === '') {
      setWinner('white');
      return;
    }
    console.log('winner = ', winner);

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });

    setPlayerTurn('white');
  }

  function onSquareClick(square) {
    setRightClickedSquares({});
    const possibleMoves = game.moves();

    if (game.game_over() && winner === '') {
      setWinner('black');
      console.log('winner = ', winner);
      return;
    } else if (game.in_draw() && winner === '') {
      setWinner('draw');
      return;
    } else if (possibleMoves.length === 0 && winner === '') {
      setWinner('black');
      return;
    }
    console.log('winner = ', winner);

    function resetFirstMove(square) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    // attempt to make move
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // if invalid, setMoveFrom and getMoveOptions
    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setPlayerTurn('black');
    setTimeout(makeRandomMove, 300);
    setMoveFrom('');
    setOptionSquares({});
  }

  function onSquareRightClick(square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  return (
    <main>
      <Header />
      <section className="chessboard-section">
        <div
          style={{
            margin: '3ren auto',
            maxWidth: '70vh',
            width: '70vw',
          }}
        >
          <Chessboard
            id="ClickToMove"
            animationDuration={200}
            arePiecesDraggable={false}
            position={game.fen()}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares,
            }}
          />
          <button
            className="button"
            onClick={() => {
              safeGameMutate((game) => {
                game.reset();
              });
              setMoveSquares({});
              setRightClickedSquares({});
              setWinner('');
            }}
          >
            Reset
          </button>
          <button
            className="button"
            onClick={() => {
              safeGameMutate((game) => {
                game.undo();
              });
              setMoveSquares({});
              setRightClickedSquares({});
              setWinner('');
            }}
          >
            Undo
          </button>
        </div>
      </section>
      {winner && (
        <div className="winner-message">
          {winner === 'Draw' ? (
            <p>It's a draw!</p>
          ) : (
            <p>{winner} won the game!</p>
          )}
          <button
            onClick={() => {
              safeGameMutate((game) => {
                game.reset();
              });
              setMoveSquares({});
              setRightClickedSquares({});
              setWinner('');
            }}
          >
            Reset
          </button>
        </div>
      )}
    </main>
  );
};

export default ChessGame;
