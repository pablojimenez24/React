import React from 'react';
import Piece from './Piece';
import './Board.css';

const Board = ({ board, selectedPiece, validMoves, onSquareClick }) => {
    const isValidMove = (row, col) => {
        return validMoves.some(move => move.row === row && move.col === col);
    };

    const isSelected = (row, col) => {
        return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    };

    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                row.map((square, colIndex) => {
                    const isDark = (rowIndex + colIndex) % 2 === 1;
                    const piece = square;

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`square ${isDark ? 'dark' : 'light'} ${isSelected(rowIndex, colIndex) ? 'selected' : ''
                                } ${isValidMove(rowIndex, colIndex) ? 'valid-move' : ''}`}
                            onClick={() => onSquareClick(rowIndex, colIndex)}
                        >
                            {piece && (
                                <Piece
                                    color={piece.color}
                                    isQueen={piece.isQueen}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSquareClick(rowIndex, colIndex);
                                    }}
                                />
                            )}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default Board;
