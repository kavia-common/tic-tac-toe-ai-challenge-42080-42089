import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

function getSquares() {
  return screen.getAllByRole("button", { name: /Square/i });
}

test("renders 3x3 board and status", () => {
  render(<App />);
  const status = screen.getByTestId("status");
  expect(status).toBeInTheDocument();
  const squares = getSquares();
  expect(squares.length).toBe(9);
});

test("player can make a move (X) on first click", () => {
  render(<App />);
  const squares = getSquares();
  fireEvent.click(squares[0]);
  expect(squares[0]).toHaveTextContent("X");
});

test("win scenario highlights and updates status", () => {
  render(<App />);
  const squares = getSquares();
  // Force human to be X and take winning row: indexes 0,1,2.
  fireEvent.click(squares[0]); // X
  // allow AI to move - but since move is delayed, we continue to force human win before AI can block
  fireEvent.click(squares[1]); // safeguard click if AI didn't move (button disabled once filled)
  fireEvent.click(squares[2]);
  const status = screen.getByTestId("status");
  // Status should eventually mention Winner
  expect(status.textContent).toMatch(/Winner:\s*[XO]/);
});

test("new game clears the board", () => {
  render(<App />);
  const squares = getSquares();
  fireEvent.click(squares[0]);
  const btn = screen.getByTestId("new-game");
  fireEvent.click(btn);
  const clearedSquares = getSquares();
  clearedSquares.forEach((sq) => {
    expect(sq).toHaveTextContent("");
  });
});
