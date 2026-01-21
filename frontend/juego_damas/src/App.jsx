import { useState, useEffect } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import WelcomeScreen from './components/WelcomeScreen';
import {
  initializeBoard,
  getValidMoves,
  executeMove,
  checkWinner,
  countPieces,
  hasCaptures
} from './utils/gameLogic';
import './App.css';

const STORAGE_KEY = 'damas-game-state';

function App() {
  const [gameStarted, setGameStarted] = useState(() => {
    // Check if there's a saved game
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null;
  });

  const [board, setBoard] = useState(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.board;
      } catch (e) {
        console.error('Error loading saved game:', e);
      }
    }
    return initializeBoard();
  });

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currentTurn || 'red';
      } catch (e) {
        return 'red';
      }
    }
    return 'red';
  });

  const [winner, setWinner] = useState(null);
  const [playerNames, setPlayerNames] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.playerNames || { red: 'Jugador Rojo', black: 'Jugador Negro' };
      } catch (e) {
        return { red: 'Jugador Rojo', black: 'Jugador Negro' };
      }
    }
    return { red: 'Jugador Rojo', black: 'Jugador Negro' };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    const gameState = {
      board,
      currentTurn,
      playerNames
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));

    // Check for winner
    const winnerColor = checkWinner(board);
    if (winnerColor) {
      setWinner(winnerColor);
    }
  }, [board, currentTurn, playerNames]);

  const handleSquareClick = (row, col) => {
    if (winner) return; // Game is over

    const clickedPiece = board[row][col];

    // If a piece is already selected
    if (selectedPiece) {
      // Check if clicked square is a valid move
      const validMove = validMoves.find(move => move.row === row && move.col === col);

      if (validMove) {
        // Execute the move
        const { newBoard, didCapture } = executeMove(
          board,
          { row: selectedPiece.row, col: selectedPiece.col },
          { row, col }
        );

        setBoard(newBoard);

        // Check if there are more captures available for the same piece
        if (didCapture) {
          const moreMoves = getValidMoves(newBoard, row, col);
          const moreCaptures = moreMoves.filter(move => move.isCapture);

          if (moreCaptures.length > 0) {
            // Continue with the same piece
            setSelectedPiece({ row, col });
            setValidMoves(moreCaptures);
            return;
          }
        }

        // End turn
        setSelectedPiece(null);
        setValidMoves([]);
        setCurrentTurn(currentTurn === 'red' ? 'black' : 'red');
      } else if (clickedPiece && clickedPiece.color === currentTurn) {
        // Select a different piece of the same color
        selectPiece(row, col, clickedPiece);
      } else {
        // Deselect
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else {
      // No piece selected, try to select one
      if (clickedPiece && clickedPiece.color === currentTurn) {
        selectPiece(row, col, clickedPiece);
      }
    }
  };

  const selectPiece = (row, col, piece) => {
    const moves = getValidMoves(board, row, col);

    // Check if captures are mandatory
    const captures = moves.filter(move => move.isCapture);
    const playerHasCaptures = hasCaptures(board, piece.color);

    if (playerHasCaptures && captures.length === 0) {
      // This piece cannot capture but others can - don't allow selection
      return;
    }

    const allowedMoves = playerHasCaptures ? captures : moves;

    setSelectedPiece({ row, col });
    setValidMoves(allowedMoves);
  };

  const handleStartGame = (player1Name, player2Name) => {
    setPlayerNames({ red: player1Name, black: player2Name });
    setGameStarted(true);
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentTurn('red');
    setWinner(null);
  };

  const handleNewGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentTurn('red');
    setWinner(null);
    setGameStarted(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const pieceCount = countPieces(board);

  // Show welcome screen if game hasn't started
  if (!gameStarted) {
    return <WelcomeScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="app">
      <div className="game-container">
        <GameInfo
          currentTurn={currentTurn}
          pieceCount={pieceCount}
          playerNames={playerNames}
          onNewGame={handleNewGame}
          winner={winner}
        />
        <Board
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
        />
      </div>
    </div>
  );
}

export default App;
