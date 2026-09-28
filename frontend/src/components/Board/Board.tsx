import { useMemo, useRef, useState, useEffect } from "react";
import { type GameState } from "../../types/game";
import {
  getCarColor,
  showSelectedCar,
  getCarDragBounds,
  getPreviewBoard,
} from "../../utils/carHelpers";
import "./Board.css";

interface BoardProps {
  gameState: GameState | null;
  initialLoading: boolean;
  disabled: boolean;
  selectedCar: string;
  hoveredCar: string | null;
  onCellClick: (car: string) => void;
  onCellEnter: (car: string) => void;
  onCellLeave: () => void;
  onMove: (car: string, steps: number) => void;
}

interface DragState {
  car: string;
  startX: number;
  startY: number;
  cellSize: number;
  axis: "H" | "V";
  min: number;
  max: number;
}

export const Board: React.FC<BoardProps> = ({
  gameState,
  initialLoading,
  disabled,
  selectedCar,
  hoveredCar,
  onCellClick,
  onCellEnter,
  onCellLeave,
  onMove,
}) => {
  const [previewCar, setPreviewCar] = useState<string | null>(null);
  const [previewOffset, setPreviewOffset] = useState(0);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    setPreviewCar(null);
    setPreviewOffset(0);
  }, [gameState?.board]);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    cell: string
  ) => {
    if (dragRef.current) return;
    if (disabled || cell === "." || !gameState) return;

    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    onCellClick(cell);

    const car = gameState.cars[cell];
    if (!car) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const bounds = getCarDragBounds(gameState.board, cell, gameState.cars);

    dragRef.current = {
      car: cell,
      startX: e.clientX,
      startY: e.clientY,
      cellSize: rect.width,
      axis: car.direction,
      min: bounds.min,
      max: bounds.max,
    };
    setPreviewCar(cell);
    setPreviewOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    const delta = drag.axis === "H" ? dx : dy;
    const rawCells = Math.round(delta / drag.cellSize);
    const clamped = Math.max(drag.min, Math.min(drag.max, rawCells));
    setPreviewOffset(clamped);
  };

  const finishDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;

    if (previewOffset !== 0) {
      onMove(drag.car, previewOffset);
    } else {
      setPreviewCar(null);
      setPreviewOffset(0);
    }
    dragRef.current = null;
  };

  const displayBoard = useMemo(() => {
    if (!gameState) return null;
    return getPreviewBoard(
      gameState.board,
      gameState.cars,
      previewCar,
      previewOffset
    );
  }, [gameState, previewCar, previewOffset]);

  const isDragging = previewCar !== null;
  const size = displayBoard?.length ?? gameState?.size ?? 6;
  const totalCells = size * size;
  const isLoading = initialLoading || !displayBoard;

  // Exit marker geometry
  const exitSide = gameState?.exit_side ?? "bottom";
  const exitPos = gameState?.exit_position ?? 0;
  const offsetPercent = ((exitPos + 0.5) / size) * 100;

  const exitPositionStyle: React.CSSProperties =
    exitSide === "right" || exitSide === "left"
      ? { top: `${offsetPercent}%` }
      : { left: `${offsetPercent}%` };

  return (
    <section className="game-stage">
      <div className="stage-top">
        <div>
          <span className="stage-label">TRAFFIC GRID</span>
          <h1>Find the way out for Car <strong style={{color: "red"}}>A</strong></h1>
        </div>

        <div className="stage-badge stage-badge-size">
          {size} × {size}
        </div>

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
        <div
          id="board"
          className="game-board"
          style={{ "--grid-size": size } as React.CSSProperties}
        >
          {isLoading
            ? Array.from({ length: totalCells }).map((_, i) => (
                <div key={`load-${i}`} className="board-cell board-cell-loading" />
              ))
            : displayBoard?.map((row, ridx) =>
                row.map((cell, cidx) => (
                  <div
                    key={`${ridx}-${cidx}`}
                    onPointerDown={(e) => handlePointerDown(e, cell)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={finishDrag}
                    onLostPointerCapture={finishDrag}
                    onMouseEnter={() => !isDragging && onCellEnter(cell)}
                    onMouseLeave={() => !isDragging && onCellLeave()}
                    className={[
                      "board-cell",
                      getCarColor(cell),
                      cell === hoveredCar && !isDragging ? "cell-hovered" : "",
                      showSelectedCar(
                        cell,
                        selectedCar,
                        ridx,
                        cidx,
                        gameState!.cars
                      ),
                      gameState?.status === "blocked" && cell === selectedCar
                        ? "animate-collide"
                        : "",
                      cell === previewCar ? "cell-dragging" : "",
                    ].join(" ")}
                  >
                    {cell !== "." && cell}
                  </div>
                ))
              )}
        </div>

        {/* Exit marker — layered over the frame so its % matches board area */}
        {!isLoading && (
          <div className="exit-layer">
            <div
              className={`exit-marker exit-${exitSide}`}
              style={exitPositionStyle}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {exitSide === "right" && <path d="M5 12h14M13 6l6 6-6 6" />}
                {exitSide === "left" && <path d="M19 12H5M11 6l-6 6 6 6" />}
                {exitSide === "bottom" && <path d="M12 5v14M6 13l6 6 6-6" />}
                {exitSide === "top" && <path d="M12 19V5M6 11l6-6 6 6" />}
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};