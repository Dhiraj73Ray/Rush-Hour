import React from "react";
import { type GameState } from "../../types/game";

interface DPadProps {
  onUp?: (car: string) => void;
  onDown?: (car: string) => void;
  onLeft?: (car: string) => void;
  onRight?: (car: string) => void;
  className?: string;
  selectedCar: string;
  loading: boolean;
  gameState: GameState | null;
}

export const DPad: React.FC<DPadProps> = ({
  onUp, onDown, onLeft, onRight,
  className = "",
  selectedCar,
  loading,
  gameState,
}) => {
  const isControlDisabled = loading || !selectedCar;
  const car = gameState?.cars && selectedCar ? gameState.cars[selectedCar] : null;
  const direction = car?.direction;
  const size = gameState?.board.length ?? 6;
  const last = size - 1;


  return (
    <div className={`dpad-grid ${className}`}>
      <div className="dpad-cell dpad-up">
        <button
          onClick={() => onUp?.(selectedCar)}
          disabled={isControlDisabled || direction === "H" || (car ? car.row === 0 : false)}
          aria-label="Move Up"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4L4 12H9V20H15V12H20L12 4Z" />
          </svg>
        </button>
      </div>

      <div className="dpad-cell dpad-left">
        <button
          onClick={() => onLeft?.(selectedCar)}
          disabled={isControlDisabled || direction === "V" || (car ? car.col === 0 : false)}
          aria-label="Move Left"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12L12 4V9H20V15H12V20L4 12Z" />
          </svg>
        </button>
      </div>

      <div className="dpad-cell dpad-right">
        <button
          onClick={() => onRight?.(selectedCar)}
          disabled={
            isControlDisabled ||
            direction === "V" ||
            (car ? car.col + car.length - 1 === last : false)
          }
          aria-label="Move Right"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12L12 4V9H4V15H12V20L20 12Z" />
          </svg>
        </button>
      </div>

      <div className="dpad-cell dpad-down">
        <button
          onClick={() => onDown?.(selectedCar)}
          disabled={
            isControlDisabled ||
            direction === "H" ||
            (car ? car.row + car.length - 1 === last : false)
          }
          aria-label="Move Down"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 20L20 12H15V4H9V12H4L12 20Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};