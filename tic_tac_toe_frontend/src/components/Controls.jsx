import React from "react";

// PUBLIC_INTERFACE
export default function Controls({
  onNewGame,
  onResetScores,
  firstPlayer,
  onToggleFirstPlayer,
  difficulty,
  onChangeDifficulty,
}) {
  /** Renders control buttons and selects for the game. */
  return (
    <div className="ttt-controls">
      <button type="button" className="btn" onClick={onNewGame} aria-label="New Game" data-testid="new-game">
        New Game
      </button>
      <button type="button" className="btn" onClick={onResetScores} aria-label="Reset Scores" data-testid="reset-scores">
        Reset Scores
      </button>
      <div className="control-group">
        <label htmlFor="firstPlayer" className="control-label">
          First Player
        </label>
        <button
          id="firstPlayer"
          type="button"
          className="btn"
          onClick={onToggleFirstPlayer}
          aria-label={`Toggle first player, currently ${firstPlayer}`}
          data-testid="toggle-first"
        >
          {firstPlayer}
        </button>
      </div>
      <div className="control-group">
        <label htmlFor="difficulty" className="control-label">
          Difficulty
        </label>
        <select
          id="difficulty"
          className="select"
          value={difficulty}
          onChange={(e) => onChangeDifficulty(e.target.value)}
          aria-label="Select difficulty"
          data-testid="difficulty"
        >
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
}
