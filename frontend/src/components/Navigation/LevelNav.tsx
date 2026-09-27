import "./LevelNav.css";

interface LevelNavProps {
  level: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenLevels: () => void;
}

export const LevelNav: React.FC<LevelNavProps> = ({
  level,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onOpenLevels,
}) => {
  return (
    <div className="level-nav">
      <button
        className="nav-btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous level"
      >
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
        <span className="level-number">
          {String(level).padStart(2, "0")}
          <span className="level-total">/{String(total).padStart(2, "0")}</span>
        </span>
      </button>

      <button
        className="nav-btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next level"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 6L15 12L9 18Z" />
        </svg>
      </button>
    </div>
  );
};