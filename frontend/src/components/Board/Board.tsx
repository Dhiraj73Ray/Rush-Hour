import { useRef } from "react";
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
  onSwipeUp: (car: string) => void;
  onSwipeDown: (car: string) => void;
  onSwipeLeft: (car: string) => void;
  onSwipeRight: (car: string) => void;
}

interface SwipeState {
  car: string;
  startX: number;
  startY: number;
  triggered: boolean;
}

const SWIPE_THRESHOLD = 18;

export const Board: React.FC<BoardProps> = ({
  gameState,
  initialLoading,
  selectedCar,
  hoveredCar,
  onCellClick,
  onCellEnter,
  onCellLeave,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const swipeRef = useRef<SwipeState | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, cell: string) => {
    if (cell === ".") return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    onCellClick(cell);
    swipeRef.current = {
      car: cell,
      startX: e.clientX,
      startY: e.clientY,
      triggered: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const sw = swipeRef.current;
    if (!sw || sw.triggered || !gameState) return;

    const dx = e.clientX - sw.startX;
    const dy = e.clientY - sw.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

    const car = gameState.cars[sw.car];
    if (!car) return;

    if (car.direction === "H" && absX > absY) {
      if (dx > 0) onSwipeRight(sw.car);
      else onSwipeLeft(sw.car);
      sw.triggered = true;
    } else if (car.direction === "V" && absY > absX) {
      if (dy > 0) onSwipeDown(sw.car);
      else onSwipeUp(sw.car);
      sw.triggered = true;
    }
  };

  const handlePointerUp = () => {
    swipeRef.current = null;
  };

  return (
    <section className="game-stage">
      <div className="stage-top">
        <div>
          <span className="stage-label">TRAFFIC GRID</span>
          <h1>Find the way out.</h1>
        </div>

        {/* Desktop only */}
        <div className="stage-badge stage-badge-size">6 × 6</div>

        {/* Mobile only — replaces 6×6 */}
        <div className="stage-badge stage-badge-selected">
          <span className="badge-label">SELECTED</span>
          <span
            className={`badge-car ${selectedCar ? getCarColor(selectedCar) : ""}`}
          >
            {selectedCar || "—"}
          </span>
        </div>
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
                    onPointerDown={(e) => handlePointerDown(e, cell)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
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
      </div>
    </section>
  );
};