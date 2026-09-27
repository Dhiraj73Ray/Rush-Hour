import React from 'react';
import './CongratsOverlay.css';

interface CongratsOverlayProps {
  /** Controls the visibility of the overlay */
  isVisible: boolean;
  /** Triggered when the user clicks Play Again */
  onReset: () => void;
  /** Optional z-index override, defaults to 9999 */
  zIndex?: number;
}

const CongratsOverlay: React.FC<CongratsOverlayProps> = ({ 
  isVisible, 
  onReset,
  zIndex = 9999 
}) => {
  // Directly driven by the prop, no internal state needed
  if (!isVisible) return null;

  return (
    <div className="congrats-backdrop" style={{ zIndex }}>
      <div className="congrats-card">
        
        <div className="animation-container">
          {/* Animated Turquoise Star */}
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
          
          {/* Animated Text */}
          <div className="text-wrapper">
            <h1 className="congrats-text">CONGRATS!</h1>
          </div>
        </div>

        <button className="play-again-btn" onClick={onReset}>
          Play Again
        </button>
        <button className="nextlvl-btn" onClick={onReset}>
          Next Level
        </button>

      </div>
    </div>
  );
};

export default CongratsOverlay;