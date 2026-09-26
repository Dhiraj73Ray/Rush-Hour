import React from "react";
import { type GameState } from "../types/game"; // Adjust import path if needed

interface DPadProps {
  onUp?: (car: string) => void;
  onDown?: (car: string) => void;
  onLeft?: (car: string) => void;
  onRight?: (car: string) => void;
  className?: string;
  selectedCar: string;
  loading: boolean; 
  gameState: GameState | null; // 1. Added gameState as a prop
}

export const DPad: React.FC<DPadProps> = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  className = "",
  selectedCar,
  loading,    
  gameState, // 2. Destructured here
}) => {
   
  const isControlDisabled = loading || !selectedCar;

  // 3. Read safely directly from passed props without calling hook
  const car = gameState?.cars && selectedCar ? gameState.cars[selectedCar] : null;
  const direction = car?.direction;

  const btnClass = 
    "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-100 " +
    "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 " +
    "disabled:opacity-40 disabled:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none disabled:transform-none";

  return (
    <div className={`grid grid-cols-3 grid-rows-3 gap-2 w-fit mx-auto relative ${className}`}>

      {/* UP - Disabled if Horizontal */}
      <div className="col-start-2 row-start-1 flex justify-center">
        <button 
          onClick={() => onUp?.(selectedCar)} 
          disabled={isControlDisabled || direction === "H"|| car?.row === 0} 
          className={btnClass} 
          aria-label="Move Up"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4L4 12H9V20H15V12H20L12 4Z" />
          </svg>
        </button>
      </div>

      {/* LEFT - Disabled if Vertical */}
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        <button 
          onClick={() => onLeft?.(selectedCar)} 
          disabled={isControlDisabled || direction === "V" || car?.col === 0} 
          className={btnClass} 
          aria-label="Move Left"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 12L12 4V9H20V15H12V20L4 12Z" />
          </svg>
        </button>
      </div>

      {/* RIGHT - Disabled if Vertical */}
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        <button 
          onClick={() => onRight?.(selectedCar)} 
          disabled={isControlDisabled || direction === "V"} 
          className={btnClass} 
          aria-label="Move Right"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 12L12 4V9H4V15H12V20L20 12Z" />
          </svg>
        </button>
      </div>

      {/* DOWN - Disabled if Horizontal */}
      <div className="col-start-2 row-start-3 flex justify-center">
        <button 
          onClick={() => onDown?.(selectedCar)} 
          disabled={isControlDisabled || direction === "H"} 
          className={btnClass} 
          aria-label="Move Down"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 20L20 12H15V4H9V12H4L12 20Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
