import "./LevelNav.css";

interface LevelNavProps {
  level: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenLevels: () => void;
}

export const LevelNav: React.FC<LevelNavProps> = ({
  level,
  onPrev,
  onNext,
  onOpenLevels,
}) => {
  return (
    <div className="level-nav">
      <button className="nav-btn" onClick={onPrev} aria-label="Previous level">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 6L9 12L15 18Z" />
        </svg>
      </button>

      <button
        className="level-display"
        onClick={onOpenLevels}
        aria-label="Open level select"
      >
        <span className="level-label">LEVEL</span>
        <span className="level-number">{String(level).padStart(2, "0")}</span>
      </button>

      <button className="nav-btn" onClick={onNext} aria-label="Next level">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6L15 12L9 18Z" />
        </svg>
      </button>
    </div>
  );
};