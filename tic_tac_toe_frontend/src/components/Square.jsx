import React from "react";

// PUBLIC_INTERFACE
export default function Square({ value, onClick, isWinning, index, disabled }) {
  /** A single square on the board. Keyboard accessible and ARIA labeled. */
  const label =
    value ? `Square ${index + 1}, ${value}` : `Square ${index + 1}, empty`;
  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "win" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!value}
      disabled={disabled}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!disabled) onClick();
        }
      }}
    >
      {value}
    </button>
  );
}
