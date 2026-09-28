import { useMemo, useRef, useState, useEffect } from "react";
import { type GameState, type CarData } from "../../types/game";
import { getCarDragBounds } from "../../utils/carHelpers";
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

function applyPreview(
  cars: Record<string, CarData>,
  previewCar: string | null,
  previewOffset: number
): Record<string, CarData> {
  if (!previewCar || previewOffset === 0) return cars;
  const car = cars[previewCar];
  if (!car) return cars;
  return {
    ...cars,
    [previewCar]:
      car.direction === "H"
        ? { ...car, col: car.col + previewOffset }
        : { ...car, row: car.row + previewOffset },
  };
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
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPreviewCar(null);
    setPreviewOffset(0);
  }, [gameState?.board]);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    carId: string
  ) => {
    if (dragRef.current) return;
    if (disabled || !gameState) return;

    const car = gameState.cars[carId];
    if (!car) return;

    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    onCellClick(carId);

    const boardRect = boardRef.current?.getBoundingClientRect();
    const cellSize = boardRect ? boardRect.width / gameState.size : 50;
    const bounds = getCarDragBounds(gameState.board, carId, gameState.cars);

    dragRef.current = {
      car: carId,
      startX: e.clientX,
      startY: e.clientY,
      cellSize,
      axis: car.direction,
      min: bounds.min,
      max: bounds.max,
    };
    setPreviewCar(carId);
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

  const size = gameState?.size ?? 6;
  const isLoading = initialLoading || !gameState;
  const isDragging = previewCar !== null;

  const displayCars = useMemo(
    () =>
      gameState
        ? applyPreview(gameState.cars, previewCar, previewOffset)
        : {},
    [gameState, previewCar, previewOffset]
  );

  const exitSide = gameState?.exit_side ?? "bottom";
  const exitPos = gameState?.exit_position ?? 0;
  const exitOffsetPercent = ((exitPos + 0.5) / size) * 100;
  const exitPositionStyle: React.CSSProperties =
    exitSide === "right" || exitSide === "left"
      ? { top: `${exitOffsetPercent}%` }
      : { left: `${exitOffsetPercent}%` };

  const badgeClass = !selectedCar
    ? "badge-car-empty"
    : selectedCar === "A"
    ? "badge-car-main"
    : "badge-car-obstacle";

  return (
    <section className="game-stage">
      <div className="stage-top">
        <div>
          <span className="stage-label">TRAFFIC GRID</span>
          <h1>Find the way out.</h1>
        </div>

        <div className="stage-badge stage-badge-size">
          {size} × {size}
        </div>

        <div className="stage-badge stage-badge-selected">
          <span className="badge-label">SELECTED</span>
          <span className={`badge-car ${badgeClass}`}>
            {selectedCar || "—"}
          </span>
        </div>
      </div>

      <div className="board-frame">
        <div
          ref={boardRef}
          id="board"
          className={`game-board ${isLoading ? "is-loading" : ""}`}
          style={{ "--grid-size": size } as React.CSSProperties}
        >
          {Array.from({ length: size * size }).map((_, i) => (
            <div key={i} className="cell-spacer" />
          ))}

          {!isLoading &&
  Object.entries(displayCars).map(([id, car]) => {
    const isSelected = id === selectedCar;
    const isHovered = id === hoveredCar && !isDragging;
    const isDraggingThis = id === previewCar;
    const isH = car.direction === "H";

    // Correct width/height per direction
    const widthPct = isH ? car.length / size : 1 / size;
    const heightPct = isH ? 1 / size : car.length / size;

    const classes = [
      "car-piece",
      id === "A" ? "car-main" : "car-obstacle",
      isSelected ? "car-selected" : "",
      isHovered ? "car-hovered" : "",
      isDraggingThis ? "car-dragging" : "",
      gameState?.status === "blocked" && isSelected ? "animate-collide" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        key={id}
        className={classes}
        style={{
          left: `calc(${(car.col / size) * 100}% + 2px)`,
          top: `calc(${(car.row / size) * 100}% + 2px)`,
          width: `calc(${widthPct * 100}% - 4px)`,
          height: `calc(${heightPct * 100}% - 4px)`,
        }}
        onPointerDown={(e) => handlePointerDown(e, id)}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onMouseEnter={() => !isDragging && onCellEnter(id)}
        onMouseLeave={() => !isDragging && onCellLeave()}
      >
        <span className="car-letter">{id}</span>
      </div>
    );
  })}
        </div>

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