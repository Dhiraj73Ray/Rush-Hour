import React from "react";
import "./CongratsOverlay.css";

interface CongratsOverlayProps {
  isVisible: boolean;
  onReset: () => void;
  onNext?: () => void;
  onClose?: () => void;
  zIndex?: number;
}

const CongratsOverlay: React.FC<CongratsOverlayProps> = ({
  isVisible,
  onReset,
  onNext,
  onClose,
  zIndex = 9999,
}) => {
  if (!isVisible) return null;

  return (
    <div className="congrats-backdrop" style={{ zIndex }}>
      <div className="congrats-card">
        {onClose && (
          <button
            className="overlay-close-btn"
            onClick={onClose}
            aria-label="Close overlay"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <div className="animation-container">
          <div className="star-wrapper">
            <svg
              className="star-svg"
              viewBox="0 0 24 24"
              fill="#5CE1E6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke="#5CE1E6"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-wrapper">
            <h1 className="congrats-text">CONGRATS!</h1>
          </div>
        </div>

        <button className="play-again-btn" onClick={onReset}>
          Play Again
        </button>
        <button className="nextlvl-btn" onClick={onNext ?? onReset}>
          Next Level
        </button>
      </div>
    </div>
  );
};

export default CongratsOverlay;