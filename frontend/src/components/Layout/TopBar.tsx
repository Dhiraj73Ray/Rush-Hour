import { LevelNav } from "../Navigation/LevelNav";
import "./TopBar.css";

interface TopBarProps {
  level: number;
  online: boolean;
  onMenu: () => void;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  onOpenLevels: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  level,
  online,
  onMenu,
  onPrevLevel,
  onNextLevel,
  onOpenLevels,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" onClick={onMenu} aria-label="Main menu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="brand">
          <div className="brand-icon">🚗</div>
          <div>
            <div className="brand-name">RUSH HOUR</div>
            <div className="brand-subtitle">TRAFFIC PUZZLE</div>
          </div>
        </div>
      </div>

      <LevelNav
        level={level}
        onPrev={onPrevLevel}
        onNext={onNextLevel}
        onOpenLevels={onOpenLevels}
      />

      <div className="topbar-right">
        <div className="exit-indicator exit-in-topbar">
          EXIT<span>→</span>
        </div>
        <div className={`online-status ${online ? "" : "offline"}`}>
          <span className="online-dot" />
          {online ? "ONLINE" : "OFFLINE"}
        </div>
      </div>
    </header>
  );
};