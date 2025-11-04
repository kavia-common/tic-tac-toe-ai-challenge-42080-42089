import React from "react";

// PUBLIC_INTERFACE
export default function Scoreboard({ scores }) {
  /** Displays current score totals for X, O, and draws. */
  const { X = 0, O = 0, draw = 0 } = scores || {};
  return (
    <div className="ttt-scoreboard" aria-label="Scoreboard">
      <div className="score">
        <span className="label">X</span>
        <span className="value" data-testid="score-x">
          {X}
        </span>
      </div>
      <div className="score">
        <span className="label">O</span>
        <span className="value" data-testid="score-o">
          {O}
        </span>
      </div>
      <div className="score">
        <span className="label">Draw</span>
        <span className="value" data-testid="score-draw">
          {draw}
        </span>
      </div>
    </div>
  );
}
