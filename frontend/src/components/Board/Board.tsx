import { type GameState } from "../../types/game";
import { getCarColor, showSelectedCar } from "../../utils/carHelpers";
import "./Board.css";

interface BoardProps {
  gameState: GameState | null;
  initialLoading: boolean;
  selectedCar: string;
  hoveredCar: string | null;
  onCellClick: (car: string) => void;
  onCellEnter: (car: string) => void;
  onCellLeave: () => void;
}

export const Board: React.FC<BoardProps> = ({
  gameState,
  initialLoading,
  selectedCar,
  hoveredCar,
  onCellClick,
  onCellEnter,
  onCellLeave,
}) => {
  return (
    <section className="game-stage">
      <div className="stage-top">
        <div>
          <span className="stage-label">TRAFFIC GRID</span>
          <h1>Find the way out.</h1>
        </div>
        <div className="stage-badge">6 × 6</div>
      </div>

      <div className="board-frame">
        <div id="board" className="game-board">
          {initialLoading
            ? Array.from({ length: 36 }).map((_, i) => (
                <div key={`load-${i}`} className="board-cell board-cell-loading" />
              ))
            : gameState?.board.map((row, ridx) =>
                row.map((cell, cidx) => (
                  <div
                    key={`${ridx}-${cidx}`}
                    onClick={() => onCellClick(cell)}
                    onMouseEnter={() => onCellEnter(cell)}
                    onMouseLeave={onCellLeave}
                    className={[
                      "board-cell",
                      getCarColor(cell),
                      cell === hoveredCar ? "cell-hovered" : "",
                      showSelectedCar(cell, selectedCar, ridx, cidx, gameState.cars),
                      gameState?.status === "blocked" && cell === selectedCar
                        ? "animate-collide"
                        : "",
                    ].join(" ")}
                  >
                    {cell !== "." && cell}
                  </div>
                ))
              )}
        </div>

        <div className="exit-indicator exit-on-board">
          EXIT<span>→</span>
        </div>
      </div>
    </section>
  );
};