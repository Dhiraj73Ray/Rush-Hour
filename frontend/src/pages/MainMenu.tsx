import { useNavigate } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import "./MainMenu.css";

const LEVEL_KEY = "rushhour.currentLevel";

export default function MainMenu() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const solved = Object.keys(progress).length;
  const lastLevel = Number(localStorage.getItem(LEVEL_KEY) ?? 0);

  return (
    <div className="menu">
      <header className="menu-header">
        <div className="menu-icon">🚗</div>
        <h1 className="menu-title">RUSH HOUR</h1>
        <p className="menu-subtitle">Traffic Puzzle</p>
      </header>

      <div className="menu-stats">
        <div className="menu-stat">
          <span className="menu-stat-label">SOLVED</span>
          <strong>{String(solved).padStart(2, "0")}</strong>
        </div>
        <div className="menu-stat">
          <span className="menu-stat-label">LAST LEVEL</span>
          <strong>{String(lastLevel + 1).padStart(2, "0")}</strong>
        </div>
      </div>

      <nav className="menu-actions">
        <button
          className="menu-btn primary"
          onClick={() => navigate("/play")}
        >
          ▶ CONTINUE
        </button>
        <button className="menu-btn" onClick={() => navigate("/play/0")}>
          ⟳ NEW GAME
        </button>
        <button className="menu-btn" onClick={() => navigate("/levels")}>
          ▦ LEVELS
        </button>
        <button className="menu-btn" onClick={() => navigate("/history")}>
          ⏱ HISTORY
        </button>
      </nav>
    </div>
  );
}