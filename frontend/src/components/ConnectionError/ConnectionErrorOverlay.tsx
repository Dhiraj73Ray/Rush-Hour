import React from 'react';
import './ConnectionErrorOverlay.css';

interface ConnectionErrorOverlayProps {
  isVisible: boolean;
  onRetry: () => void;
}

const ConnectionErrorOverlay: React.FC<ConnectionErrorOverlayProps> = ({ isVisible, onRetry }) => {
  if (!isVisible) return null;

  return (
    <div className="conn-error-backdrop">
      <div className="conn-error-card">
        <div className="conn-error-icon">⚠️</div>
        <h2 className="conn-error-title">Connection Lost</h2>
        <p className="conn-error-text">
          Cannot connect to the backend server. Please make sure it is running.
        </p>
        <button className="conn-error-btn" onClick={onRetry}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default ConnectionErrorOverlay;