import React from "react";

interface DPadProps {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  className?: string;
}

export const DPad: React.FC<DPadProps> = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  className = "",
}) => {
  // Added dimensions (w-12 h-12), background color, text color, and hover states
  const btnClass = "flex items-center justify-center w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-100 active:scale-95";

  return (
    <div className={`grid grid-cols-3 grid-rows-3 gap-2 w-fit mx-auto ${className}`} >
      {/* UP */}
      <div className="col-start-2 row-start-1 flex justify-center">
        <button onClick={onUp} className={btnClass} aria-label="Move Up">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 4L4 12H9V20H15V12H20L12 4Z" />
          </svg>
        </button>
      </div>

      {/* LEFT */}
      <div className="col-start-1 row-start-2 flex justify-center items-center">
        <button onClick={onLeft} className={btnClass} aria-label="Move Left">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 12L12 4V9H20V15H12V20L4 12Z" />
          </svg>
        </button>
      </div>

      {/* RIGHT */}
      <div className="col-start-3 row-start-2 flex justify-center items-center">
        <button onClick={onRight} className={btnClass} aria-label="Move Right">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 12L12 4V9H4V15H12V20L20 12Z" />
          </svg>
        </button>
      </div>

      {/* DOWN */}
      <div className="col-start-2 row-start-3 flex justify-center">
        <button onClick={onDown} className={btnClass} aria-label="Move Down">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 20L20 12H15V4H9V12H4L12 20Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
