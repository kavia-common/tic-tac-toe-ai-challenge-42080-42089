import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import Scoreboard from "./components/Scoreboard";
import Controls from "./components/Controls";
import { calculateWinner, isBoardFull, getAvailableMoves } from "./utils/gameLogic";
import { aiMoveEasy, aiMoveHard } from "./utils/ai";

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe App: manages game state, AI turns, controls, and theming.
   * Honors optional debug via REACT_APP_LOG_LEVEL and feature flags via REACT_APP_FEATURE_FLAGS.
   */
  const [theme, setTheme] = useState("light");

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [firstPlayer, setFirstPlayer] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("easy"); // easy | hard
  const [status, setStatus] = useState("Next player: X");
  const [winningLine, setWinningLine] = useState(null);
  const [locked, setLocked] = useState(false);

  // Optional debug logging and feature flags
  const debug = useMemo(() => String(process.env.REACT_APP_LOG_LEVEL || "").toLowerCase() === "debug", []);
  const featureFlags = useMemo(() => {
    const raw = String(process.env.REACT_APP_FEATURE_FLAGS || "");
    return raw
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  }, []);
  const enableNoiseBg = featureFlags.includes("retroNoiseBg");
  const enableAnimations = featureFlags.includes("animations");

  const statusLiveRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function logDebug(...args) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log("[DEBUG]", ...args);
    }
  }

  function applyStatus(newStatus) {
    setStatus(newStatus);
    // ARIA live region announcement
    if (statusLiveRef.current) {
      statusLiveRef.current.textContent = newStatus;
    }
  }

  // Determine if it's AI's turn (AI is whoever is not human).
  // In this version, assume human is always the "first player" for their turn,
  // and AI plays as the other marker when it's their turn.
  const currentPlayer = xIsNext ? "X" : "O";
  const aiPlayer = firstPlayer === "X" ? "O" : "X";
  const isAiTurn = currentPlayer === aiPlayer;

  // Handle AI move automatically after human moves
  useEffect(() => {
    const winnerResult = calculateWinner(squares);
    if (winnerResult) return; // game already ended
    if (isBoardFull(squares)) return; // draw state; handled elsewhere
    if (!isAiTurn) return;

    const makeMove = () => {
      let aiMove = null;
      if (difficulty === "hard") {
        aiMove = aiMoveHard(squares, aiPlayer);
      } else {
        aiMove = aiMoveEasy(squares);
      }
      if (aiMove === null || aiMove === undefined) return;

      logDebug("AI move at index", aiMove, "difficulty:", difficulty);
      onSquareClick(aiMove);
    };

    // slight delay to feel natural
    const t = setTimeout(makeMove, enableAnimations ? 250 : 0);
    return () => clearTimeout(t);
  }, [squares, isAiTurn, difficulty, aiPlayer, enableAnimations]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update status and scores when board changes
  useEffect(() => {
    const res = calculateWinner(squares);
    if (res && res.winner) {
      setWinningLine(res.line);
      applyStatus(`Winner: ${res.winner}`);
      setLocked(true);
      setScores((prev) => ({ ...prev, [res.winner]: (prev[res.winner] || 0) + 1 }));
    } else if (isBoardFull(squares)) {
      setWinningLine(null);
      applyStatus("It's a draw!");
      setLocked(true);
      setScores((prev) => ({ ...prev, draw: (prev.draw || 0) + 1 }));
    } else {
      setWinningLine(null);
      applyStatus(`Next player: ${currentPlayer}`);
    }
  }, [squares, currentPlayer]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  function onSquareClick(i) {
    /** Handles a player's action on a square if allowed. */
    if (locked) return;
    if (calculateWinner(squares)) return;
    if (squares[i]) return;

    const next = squares.slice();
    next[i] = currentPlayer;
    setSquares(next);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    /** Clears the board, preserves scores, and honors firstPlayer setting for next turn. */
    setSquares(Array(9).fill(null));
    setLocked(false);
    setWinningLine(null);
    const humanStarts = firstPlayer;
    setXIsNext(humanStarts === "X");
    applyStatus(`Next player: ${humanStarts}`);
  }

  // PUBLIC_INTERFACE
  function handleResetScores() {
    /** Reset scoreboard totals. */
    setScores({ X: 0, O: 0, draw: 0 });
  }

  // PUBLIC_INTERFACE
  function handleToggleFirstPlayer() {
    /** Toggle first player between X and O; does not change current game until New Game. */
    setFirstPlayer((prev) => (prev === "X" ? "O" : "X"));
  }

  // PUBLIC_INTERFACE
  function handleChangeDifficulty(level) {
    /** Set difficulty to 'easy' or 'hard'. */
    setDifficulty(level === "hard" ? "hard" : "easy");
  }

  // Initial mount: set starting player status
  useEffect(() => {
    applyStatus(`Next player: ${xIsNext ? "X" : "O"}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optional: subtle background noise effect class
  const appHeaderClass = `App-header${enableNoiseBg ? " noise-bg" : ""}`;

  return (
    <div className="App">
      <header className={appHeaderClass}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <div className="ttt-container">
          <h1 className="title">Tic Tac Toe</h1>
          <div
            aria-live="polite"
            aria-atomic="true"
            className="ttt-status"
            data-testid="status"
            ref={statusLiveRef}
          >
            {status}
          </div>

          <Scoreboard scores={scores} />

          <Board
            squares={squares}
            onSquareClick={onSquareClick}
            winningLine={winningLine}
            locked={locked}
          />

          <Controls
            onNewGame={handleNewGame}
            onResetScores={handleResetScores}
            firstPlayer={firstPlayer}
            onToggleFirstPlayer={handleToggleFirstPlayer}
            difficulty={difficulty}
            onChangeDifficulty={handleChangeDifficulty}
          />

          <div className="footer-note">
            Use Tab/Enter to play. Difficulty: {difficulty}. First: {firstPlayer}.
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
