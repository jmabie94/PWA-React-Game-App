import React, { useEffect } from 'react';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import Cell from '../singleplayer/Cell';
import './pvp.css';
import Header from './headerPvP';
import { GET_GAME_STATE } from '../../../utils/queries';
import { MAKE_MOVE } from '../../../utils/mutations';
import { GAME_STATE_SUBSCRIPTION } from '../../../utils/subscriptions';

const BoardPvP = () => {
  const { loading, error, data, client } = useQuery(GET_GAME_STATE);
  const [makeMove] = useMutation(MAKE_MOVE);
  const { data: subscriptionData } = useSubscription(GAME_STATE_SUBSCRIPTION);

  useEffect(() => {
    if (subscriptionData) {
      updateGameState(subscriptionData.gameStateUpdated);
      checkWinner();
    }
  }, [subscriptionData]);

  const updateGameState = (newState) => {
    const { id, name, board, playerTurn, winner, isGameEnded } = newState;

    // Retrieve the current game state from the Apollo Client cache
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

    // Write the updated game state back to the Apollo Client cache
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

  const handleCellClick = (index) => {
    if (
      loading ||
      error ||
      !data ||
      data.game.winner ||
      data.game.board[index] !== '' ||
      data.game.isGameEnded ||
      data.game.playerTurn !== `${currentPlayer}` // Replace 'currentPlayer' with the current player's ID
    ) {
      return;
    }

    makeMove({ variables: { index } });
  };

  const checkWinner = () => {
    const { board } = data.game;

    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        // Set the winner and isGameEnded in the Apollo Client cache
        const updatedData = {
          ...data,
          game: {
            ...data.game,
            winner: board[a],
            isGameEnded: true,
          },
        };
        client.writeQuery({
          query: GET_GAME_STATE,
          variables: { gameId: data.game.id },
          data: updatedData,
        });
        return;
      }
    }

    if (!board.includes('')) {
      // Set the draw result and isGameEnded in the Apollo Client cache
      const updatedData = {
        ...data,
        game: {
          ...data.game,
          winner: 'Draw',
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

  const handleReset = () => {
    const existingData = client.readQuery({
      query: GET_GAME_STATE,
      variables: { gameId: data.game.id },
    });

    const updatedData = {
      ...existingData,
      game: {
        ...existingData.game,
        board: Array(9).fill(''),
        winner: null,
        isGameEnded: false,
      },
    };

    client.writeQuery({
      query: GET_GAME_STATE,
      variables: { gameId: data.game.id },
      data: updatedData,
    });
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
      <section className="board-section">
        {board.map((cell, index) => (
          <Cell
            key={index}
            handleCellClick={() => handleCellClick(index)}
            id={index.toString()}
            text={cell}
          />
        ))}
      </section>

      {winner && (
        <div className="winner-message">
          {winner === 'Draw' ? (
            <p>It's a draw!</p>
          ) : (
            <p>{winner} won the game!</p>
          )}
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </main>
  );
};

export default BoardPvP;
