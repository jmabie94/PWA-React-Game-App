// taking the reformatted Chessboard.js and trying to use the attempt at two-player logic for TicTacToe to create a two-player logic set up for Chess
// removed the rightClicked stuff from single player cause it seemed overly complicated and unnecessary to implement here

import React, { useEffect } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import './pvp.css';
import Header from './headerPvP';
import { GET_GAME_STATE } from '../../../utils/queries';
import { MAKE_MOVE } from '../../../utils/mutations';
import { GAME_STATE_SUBSCRIPTION } from '../../../utils/subscriptions';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const ChessGamePvP = () => {
  const { loading, error, data, client } = useQuery(GET_GAME_STATE);
  const [makeMove] = useMutation(MAKE_MOVE);
  const { data: subscriptionData } = useSubscription(GAME_STATE_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData) {
      updateGameState(subscriptionData.gameStateUpdate);
      checkWinner();
    }
  }, [subscriptionData]);

  const updateGameState = (newState) => {
    const { id, name, board, playerTurn, winner, isGameEnded } = newState;

    const existingData = client.readQuery({
      query: gql`
        query GetGameState($gameId: String!) {
          game(gameId: $gameId) {
            id
            name
            board
            playerTurn
            winner
            isGameEnded
          }
        }
      `,
      variables: { gameId: id },
    });

    const updatedData = {
      ...existingData,
      game: {
        ...existingData.game,
        name,
        board,
        playerTurn,
        winner,
        isGameEnded,
      },
    };

    client.writeQuery({
      query: gql`
        query GetGameState($gameId: String!) {
          game(gameId: $gameId) {
            id
            name
            board
            playerTurn
            winner
            isGameEnded
          }
        }
      `,
      variables: { gameId: id },
      data: updatedData,
    });
  };

  const onSquareClick = (square) => {
    if (
      loading ||
      error ||
      !data ||
      data.game.winner ||
      data.game.board[square] === !legalMoves() ||
      data.game.isGameEnded ||
      data.game.playerTurn !== `${currentPlayer}` // Replace 'currentPlayer' with the current player's ID
    ) {
      return;
    }

    makeMove({ variables: { square } });
  };

  const checkWinner = () => {
    const { board } = data.game;

    if (playerTurn && !legalMoves()) {
      const updatedData = {
        ...data,
        game: {
          ...data.game,
          winner: 'Opponent',
          isGameEnded: true,
        },
      };
      client.writeQuery({
        query: GET_GAME_STATE,
        variables: { gameId: data.game.id },
        data: updatedData,
      });
      return;
    } else if (!playerTurn && !legalMoves()) {
      const updatedData = {
        ...data,
        game: {
          ...data.game,
          winner: 'You',
          isGameEnded: true,
        },
      };
      client.writeQuery({
        query: GET_GAME_STATE,
        variables: { gameId: data.game.id },
        data: updatedData,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { board, playerTurn, winner, isGameEnded } = data.game;

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

export default ChessGamePvP;
