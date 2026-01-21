import React from 'react';
import './Piece.css';

const Piece = ({ color, isQueen, onClick }) => {
    return (
        <div
            className={`piece piece-${color} ${isQueen ? 'queen' : ''}`}
            onClick={onClick}
        >
            {isQueen && <span className="crown">♔</span>}
        </div>
    );
};

export default Piece;
