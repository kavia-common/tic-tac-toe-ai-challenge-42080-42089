//
// Game logic utilities for Tic Tac Toe
//

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine if there is a winning combination on the board.
   * Returns an object { winner: 'X'|'O', line: [a,b,c] } or null if no winner.
   */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export function isBoardFull(squares) {
  /** Returns true when no empty squares exist. */
  return squares.every((s) => s !== null && s !== undefined && s !== "");
}

// PUBLIC_INTERFACE
export function getAvailableMoves(squares) {
  /** Returns indices of all empty squares. */
  const moves = [];
  for (let i = 0; i < squares.length; i += 1) {
    if (!squares[i]) moves.push(i);
  }
  return moves;
}

// PUBLIC_INTERFACE
export function cloneBoard(squares) {
  /** Shallow copy of the board array. */
  return [...squares];
}
