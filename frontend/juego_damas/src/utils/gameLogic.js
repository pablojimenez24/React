/**
 * Game Logic for Checkers/Damas
 * Pure functions for game state management and rule validation
 */

/**
 * Initialize a new game board with pieces in starting positions
 * @returns {Array} 8x8 board matrix
 */
export function initializeBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place black pieces (top 3 rows)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      // Only on dark squares (where row + col is odd for standard board)
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'black', isQueen: false };
      }
    }
  }
  
  // Place red pieces (bottom 3 rows)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: 'red', isQueen: false };
      }
    }
  }
  
  return board;
}

/**
 * Get all valid moves for a piece at given position
 * @param {Array} board - Current board state
 * @param {number} row - Piece row
 * @param {number} col - Piece column
 * @returns {Array} Array of {row, col, isCapture, capturedPiece} objects
 */
export function getValidMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves = [];
  const directions = piece.isQueen 
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // Queens move all directions
    : piece.color === 'red'
      ? [[-1, -1], [-1, 1]] // Red moves up
      : [[1, -1], [1, 1]];  // Black moves down
  
  // Check regular moves and captures
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    // Regular move
    if (isInBounds(newRow, newCol) && board[newRow][newCol] === null) {
      moves.push({ row: newRow, col: newCol, isCapture: false });
    }
    
    // Capture move
    const jumpRow = row + dRow * 2;
    const jumpCol = col + dCol * 2;
    
    if (isInBounds(jumpRow, jumpCol) && 
        isInBounds(newRow, newCol) &&
        board[newRow][newCol] !== null &&
        board[newRow][newCol].color !== piece.color &&
        board[jumpRow][jumpCol] === null) {
      moves.push({ 
        row: jumpRow, 
        col: jumpCol, 
        isCapture: true,
        capturedPiece: { row: newRow, col: newCol }
      });
    }
  }
  
  return moves;
}

/**
 * Check if position is within board bounds
 */
function isInBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Check if any piece of given color has capture moves available
 * @param {Array} board - Current board state
 * @param {string} color - 'red' or 'black'
 * @returns {boolean}
 */
export function hasCaptures(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, row, col);
        if (moves.some(move => move.isCapture)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Execute a move and return new board state
 * @param {Array} board - Current board state
 * @param {Object} from - {row, col}
 * @param {Object} to - {row, col}
 * @returns {Object} {newBoard, didCapture, shouldPromote}
 */
export function executeMove(board, from, to) {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  
  // Move the piece
  newBoard[to.row][to.col] = { ...piece };
  newBoard[from.row][from.col] = null;
  
  // Check if it's a capture
  let didCapture = false;
  const rowDiff = Math.abs(to.row - from.row);
  
  if (rowDiff === 2) {
    // This is a capture
    const capturedRow = (from.row + to.row) / 2;
    const capturedCol = (from.col + to.col) / 2;
    newBoard[capturedRow][capturedCol] = null;
    didCapture = true;
  }
  
  // Check for promotion to queen
  let shouldPromote = false;
  if (!piece.isQueen) {
    if ((piece.color === 'red' && to.row === 0) ||
        (piece.color === 'black' && to.row === 7)) {
      newBoard[to.row][to.col].isQueen = true;
      shouldPromote = true;
    }
  }
  
  return { newBoard, didCapture, shouldPromote };
}

/**
 * Check if there's a winner
 * @param {Array} board - Current board state
 * @returns {string|null} 'red', 'black', or null
 */
export function checkWinner(board) {
  let redCount = 0;
  let blackCount = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === 'red') redCount++;
        else blackCount++;
      }
    }
  }
  
  if (redCount === 0) return 'black';
  if (blackCount === 0) return 'red';
  
  return null;
}

/**
 * Count pieces for each player
 * @param {Array} board - Current board state
 * @returns {Object} {red: number, black: number}
 */
export function countPieces(board) {
  let red = 0;
  let black = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === 'red') red++;
        else black++;
      }
    }
  }
  
  return { red, black };
}
