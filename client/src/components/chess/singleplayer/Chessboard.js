// Chessboard using react-chessboard
// this iteration of the starting logic is under the "Click To Move" demo provided by the react-chessboard npm documents
// going to need a refactored version which makes the game two player for the ChessboardPvP file
// missing functionality to announce victory and which user has won, also missing warning for players in checkmate

import React, { useEffect, useState } from 'react';
import './solo.css';
import Header from './header';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

// I don't think any of the rightClicked stuff is needed
const ChessGame = () => {
  // changed game, setGame to board, setBoard to match TicTacToe formatting (thinking of db queries)
  const [board, setBoard] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  //   const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [winner, setWinner] = userState('');

  useEffect(() => {
    checkWinner();
    if (!playerTurn && winner === '' && !isGameEnded) {
      makeBotMove();
    }
  }, [board, playerTurn, winner, isGameEnded]);

  const safeMutation = (change) => {
    setBoard((g) => {
      const update = { ...g };
      change(update);
      return update;
    });
  };

  const legalMoves = (square) => {
    const moves = board.moves({
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
          board.get(move.to) &&
          board.get(move.to).color !== board.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.2) 75%, transparent 75%'
            : 'radial-gradient(circle, rgba(0,0,0,.2) 30%, transparent 30%',
        borderRadius: '25%',
      };
      return move;
    });

    newSquares[square] = {
      background: 'rgba(225, 225, 0, 0.5)',
    };

    setOptionSquares(newSquares);
    return true;
  };

  const checkWinner = () => {
    if (playerTurn && !legalMoves()) {
      setIsGameEnded(true);
      setWinner('Computer');
      return;
    } else if (!playerTurn && !legalMoves()) {
      setIsGameEnded(true);
      setWinner('Player 1');
    }
  };

  const makeBotMove = () => {
    const possibleMoves = board.moves();

    // need to add a function for displaying checkmate that checks for possibleMoves.length === 1
    if (
      board.game_over() ||
      board.in_draw() ||
      possibleMoves.length === 0 ||
      isGameEnded
    ) {
      setIsGameEnded(true);
      return;
    }
    // need add functionality to display the winning user whenever the game ends, similar to TicTacToe

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeMutation((board) => {
      board.move(possibleMoves[randomIndex]);
    });

    setIsGameEnded(false);
    setPlayerTurn(true);
  };

  const onSquareClick = (square) => {
    // setRightClickedSquares({});

    const resetFirstMove = (square) => {
      const hasOptions = legalMoves(square);
      if (hasOptions) {
        setMoveFrom(square);
      }
    };

    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const gameCopy = { ...board };
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: 'q',
    });

    setBoard(gameCopy);

    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setTimeout(makeBotMove, 850);
    setMoveFrom('');
    setOptionSquares({});
    setPlayerTurn(!playerTurn);
  };

  //   const onSquareRightClick = (square) => {
  //     const color = 'rgba (0, 0, 225, 0.5)';
  //     setRightClickedSquares({
  //       ...rightClickedSquares,
  //       [square]:
  //         rightClickedSquares[square] &&
  //         rightClickedSquares[square].backgroundColor === color
  //           ? undefined
  //           : { backgroundColor: color },
  //     });
  //   };

  return (
    <main>
      <Header />
      <section className="chessboard-section">
        <div style={boardWrapper}>
          <Chessboard
            id="ClickToMove"
            animationDuration={200}
            arePiecesDraggable={false}
            showBoardNotation={true}
            position={game.fen()}
            onSquareClick={onSquareClick}
            // onSquareRightClick={onSquareRightClick}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
              ...rightClickedSquares,
            }}
          >
            <button
              style={buttonStyle}
              onClick={() => {
                safeMutation((board) => {
                  board.reset();
                });
                setMoveSquares({});
                // setRightClickedSquares({});
              }}
            >
              Reset
            </button>
            <button
              style={buttonStyle}
              onClick={() => {
                safeMutation((board) => {
                  board.undo();
                });
                setMoveSquares({});
                // setRightClickedSquares({});
              }}
            >
              Undo
            </button>
          </Chessboard>
        </div>
      </section>

      {winner && (
        <div className="winner-message">
          {winner === 'Computer' ? (
            <p>You Lost To A {winner}</p>
          ) : (
            <p>{winner} won the game!</p>
          )}
        </div>
      )}
    </main>
  );
};

export default ChessGame;
