import { useNavigate } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import "./HistoryPage.css";

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const fmtDate = (ts: number) => new Date(ts).toLocaleString();

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, clearAll } = useProgress();

  return (
    <div className="history-page">
      <header className="history-header">
        <button className="back-btn" onClick={() => navigate("/menu")}>
          ← BACK
        </button>
        <h1>HISTORY</h1>
        {history.length > 0 ? (
          <button
            className="clear-btn"
            onClick={() => {
              if (confirm("Clear all history and progress?")) clearAll();
            }}
          >
            CLEAR
          </button>
        ) : (
          <span />
        )}
      </header>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">🏁</div>
          <p>No solved puzzles yet.</p>
          <button
            className="menu-btn primary"
            onClick={() => navigate("/play")}
          >
            ▶ START PLAYING
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((h) => (
            <div key={h.level} className="history-row">
              <div className="history-num">
                {String(h.level + 1).padStart(2, "0")}
              </div>
              <div className="history-info">
                <div className="history-solved">Solved</div>
                <div className="history-date">{fmtDate(h.solvedAt)}</div>
              </div>
              <div className="history-stats">
                <span>{h.bestMoves} moves</span>
                <span>{fmtTime(h.bestSeconds)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}