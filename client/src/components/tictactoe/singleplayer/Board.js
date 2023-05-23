import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import "./solo.css";
import Header from "./header";

const Board = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [winner, setWinner] = useState("");
  const [isGameEnded, setIsGameEnded] = useState(false);

  useEffect(() => {
    checkWinner();
    if (!playerTurn && winner === "" && !isGameEnded) {
      makeBotMove();
    }
  }, [board, playerTurn, winner, isGameEnded]);
    //checkwinner,makebotmove eslint

  const handleCellClick = (index) => {
    if (winner || board[index] !== "" || isGameEnded) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = playerTurn ? "X" : "O";
    setBoard(newBoard);
    setPlayerTurn(!playerTurn);
  };

  const makeBotMove = () => {
    if (winner || !board.includes("") || isGameEnded) {
        return;
    }
    setIsGameEnded(true);
    setTimeout(() => {
      const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === "") {
          acc.push(index);
        }
        return acc;
      }, []);

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const botMoveIndex = emptyCells[randomIndex];

      const newBoard = [...board];
      newBoard[botMoveIndex] = "O";
      setBoard(newBoard);

      setIsGameEnded(false);
      setPlayerTurn(true);
    }, 850);
  };

  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setIsGameEnded(true);
        return;
      }
    }

    if (!board.includes("")) {
      setWinner("Draw");
      setIsGameEnded(true);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(""));
    setWinner("");
    setPlayerTurn(true);
    setIsGameEnded(false);
  };

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
          {winner === "Draw" ? (
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

export default Board;
