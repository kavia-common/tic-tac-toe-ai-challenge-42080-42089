//
// AI utilities for Tic Tac Toe: easy (random) and hard (heuristic)
//
import { calculateWinner, getAvailableMoves, cloneBoard } from "./gameLogic";

// PUBLIC_INTERFACE
export function aiMoveEasy(squares) {
  /** Returns a random valid move index or null if none. */
  const moves = getAvailableMoves(squares);
  if (moves.length === 0) return null;
  const idx = Math.floor(Math.random() * moves.length);
  return moves[idx];
}

// PUBLIC_INTERFACE
export function aiMoveHard(squares, aiPlayer) {
  /**
   * Heuristic strategy:
   * 1) Win if possible
   * 2) Block opponent win
   * 3) Take center
   * 4) Take a corner
   * 5) Take a side
   */
  const opponent = aiPlayer === "X" ? "O" : "X";
  const available = getAvailableMoves(squares);
  if (available.length === 0) return null;

  // 1) Win if possible
  for (const m of available) {
    const test = cloneBoard(squares);
    test[m] = aiPlayer;
    const result = calculateWinner(test);
    if (result && result.winner === aiPlayer) return m;
  }

  // 2) Block opponent
  for (const m of available) {
    const test = cloneBoard(squares);
    test[m] = opponent;
    const result = calculateWinner(test);
    if (result && result.winner === opponent) return m;
  }

  // 3) Center
  if (available.includes(4)) return 4;

  // 4) Corners
  const corners = [0, 2, 6, 8];
  const openCorner = corners.find((c) => available.includes(c));
  if (openCorner !== undefined) return openCorner;

  // 5) Sides
  const sides = [1, 3, 5, 7];
  const openSide = sides.find((s) => available.includes(s));
  if (openSide !== undefined) return openSide;

  // Fallback
  return available[0] ?? null;
}
