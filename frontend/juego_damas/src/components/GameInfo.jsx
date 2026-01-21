import React from 'react';
import './GameInfo.css';

const GameInfo = ({ currentTurn, pieceCount, playerNames, onNewGame, winner }) => {
    const getAvatarUrl = (playerName) => {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(playerName)}`;
    };

    return (
        <div className="game-info">
            <h1 className="game-title">Damas</h1>

            <div className="players-container">
                {/* Red Player */}
                <div className={`player-card ${currentTurn === 'red' ? 'active' : ''}`}>
                    <img
                        src={getAvatarUrl(playerNames.red)}
                        alt={playerNames.red}
                        className="avatar"
                    />
                    <div className="player-details">
                        <h3 className="player-name">{playerNames.red}</h3>
                        <div className="piece-indicator red"></div>
                        <p className="piece-count">{pieceCount.red} piezas</p>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="vs-divider">VS</div>

                {/* Black Player */}
                <div className={`player-card ${currentTurn === 'black' ? 'active' : ''}`}>
                    <img
                        src={getAvatarUrl(playerNames.black)}
                        alt={playerNames.black}
                        className="avatar"
                    />
                    <div className="player-details">
                        <h3 className="player-name">{playerNames.black}</h3>
                        <div className="piece-indicator black"></div>
                        <p className="piece-count">{pieceCount.black} piezas</p>
                    </div>
                </div>
            </div>

            {/* Turn Indicator */}
            {!winner && (
                <div className="turn-indicator">
                    <p>Turno de: <span className={`turn-${currentTurn}`}>{playerNames[currentTurn]}</span></p>
                </div>
            )}

            {/* Winner Announcement */}
            {winner && (
                <div className="winner-announcement">
                    <h2>🏆 ¡{playerNames[winner]} ha ganado! 🏆</h2>
                </div>
            )}

            {/* New Game Button */}
            <button className="new-game-btn" onClick={onNewGame}>
                Nueva Partida
            </button>
        </div>
    );
};

export default GameInfo;
