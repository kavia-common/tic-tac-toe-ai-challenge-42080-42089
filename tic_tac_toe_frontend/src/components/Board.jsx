import React from "react";
import Square from "./Square";

// PUBLIC_INTERFACE
export default function Board({ squares, onSquareClick, winningLine, locked }) {
  /** Board renders a 3x3 grid of Square components. */
  function renderSquare(i) {
    const isWinning = Array.isArray(winningLine) && winningLine.includes(i);
    return (
      <Square
        key={i}
        index={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        isWinning={isWinning}
        disabled={locked || !!squares[i]}
      />
    );
  }

  return (
    <div role="grid" aria-label="Tic Tac Toe board" className="ttt-board">
      <div role="row" className="ttt-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div role="row" className="ttt-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div role="row" className="ttt-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
