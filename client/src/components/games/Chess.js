// Chessboard using react-chessboard
// Logic functions provided in the documentation by way of the npm package
// needs logic to make it two player, to assign players to black or white pieces, to announce victory instead of just stopping abruptly, and to mark checkmate when applicable.
// this version of the starting logic is under the "Click To Move" functionality provided by the creators of the react-chessboard npm
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function chessGameHandler() {
    const [game, setGame] = useState(new Chess());
    const [moveFrom, setMoveFrom] = useState('');
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveSquares, setMoveSquares] = useState({});
    const [optionSquares, setOptionSquares] = useState({});

    function safeMutation(change) {
        setGame((g) => {
            const update = { ...g };
            change(update);
            return update;
        });
    }

    function legalMoves(square) {
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
                    game.get(move.to) && game.get(move.to).color !== game.get(square).color
                        ? "radial-gradient(circle, rgba(0,0,0,.2) 75%, transparent 75%"
                        : "radial-gradient(circle, rgba(0,0,0,.2) 30%, transparent 30%",
                borderRadius: "50%",
            };
            return move;
        });

        newSquares[square] = {
            background: "rgba(225, 225, 0, 0.5",
        };

        setOptionSquares(newSquares);
        return true;
    }

    function makeRandomMove() {
        const possibleMoves = game.moves();

        // need to add some kind of alert or pop up declaring the winner and automatically resetting the board after a setTimeout()
        if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
        // need to add some kind of alert if possibleMoves.length === 1, as that would most likely mean that the person whose turn it is has been placed in checkmate

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        safeMutation((game) => {
            game.move(possibleMoves[randomIndex]);
        });
    }

    function onSquareClick(square) {
        setRightClickedSquares({});

        function resetFirstMove(square) {
            const hasOptions = legalMoves(square);
            if (hasOptions) setMoveFrom(square);
        }

        if (!moveFrom) {
            resetFirstMove(square);
            return;
        }

        // should utilize similar logic to then save gameCopies to the database so that if someone disconnects or the page refreshes, it can restore the board
        const gameCopy = { ...game };
        const move = gameCopy.move({
            from: moveFrom,
            to: square,
            promotion: "q",
        });
        
        setGame(gameCopy);

        if (move === null) {
            resetFirstMove(square);
            return;
        }

        setTimeout(makeRandomMove, 300);
        setMoveFrom("");
        setOptionSquares({});
    }

    function onSquareRightClick(square) {
        const color = "rgba (0, 0, 225, 0.4)";
        setRightClickedSquares({
            ...rightClickedSquares,
            [square]:
                rightClickedSquares[square] &&
                    rightClickedSquares[square].backgroundColor === color
                    ? undefined
                    : { backgroundColor: color },
        });
    }

    return (
        <div style={boardWrapper}>
            <Chessboard
                id="ClickToMove"
                animationDuration={200}
                arePiecesDraggable={false}
                showBoardNotation={true}
                position={game.fen()}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
                customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                }}>
                <button style={buttonStyle}
                onClick={() => {
                    safeMutation((game) => {
                        game.reset();
                    });
                    setMoveSquares({});
                    setRightClickedSquares({});
                }}>Reset</button>
                <button style={buttonStyle}
                onClick={() => {
                    safeMutation((game) => {
                        game.undo();
                    });
                    setMoveSquares({});
                    setRightClickedSquares({});
                }}>Undo</button>
            </Chessboard>
        </div>
    );
};