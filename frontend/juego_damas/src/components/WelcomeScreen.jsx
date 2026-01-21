import React, { useState } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onStartGame }) => {
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const p1 = player1Name.trim() || 'Jugador Rojo';
        const p2 = player2Name.trim() || 'Jugador Negro';
        onStartGame(p1, p2);
    };

    return (
        <div className="welcome-screen">
            <div className="welcome-card">
                <h1 className="welcome-title">Damas</h1>

                <form onSubmit={handleSubmit} className="player-form">
                    <div className="form-group">
                        <label htmlFor="player1">
                            <div className="player-indicator red"></div>
                            Jugador 1 (Rojas)
                        </label>
                        <input
                            type="text"
                            id="player1"
                            value={player1Name}
                            onChange={(e) => setPlayer1Name(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            maxLength={20}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="player2">
                            <div className="player-indicator black"></div>
                            Jugador 2 (Negras)
                        </label>
                        <input
                            type="text"
                            id="player2"
                            value={player2Name}
                            onChange={(e) => setPlayer2Name(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            maxLength={20}
                        />
                    </div>

                    <button type="submit" className="start-button">
                        Comenzar Partida
                    </button>
                </form>


            </div>
        </div>
    );
};

export default WelcomeScreen;
