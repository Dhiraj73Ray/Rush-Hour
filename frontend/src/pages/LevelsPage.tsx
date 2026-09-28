import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLevels } from "../api/gameApi";
import { useProgress } from "../hooks/useProgress";
import { type LevelInfo } from "../types/game";
import "./LevelsPage.css";

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function LevelsPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLevels()
      .then((data) => setLevels(data.levels))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const solvedCount = levels.filter((l) => progress[l.index]?.solved).length;

  return (
    <div className="levels-page">
      <header className="levels-header">
        <button className="back-btn" onClick={() => navigate("/menu")}>
          ← BACK
        </button>
        <h1>LEVELS</h1>
        <span className="levels-count">
          {solvedCount} / {levels.length}
        </span>
      </header>

      {loading && <div className="levels-msg">Loading…</div>}
      {error && (
        <div className="levels-msg">Couldn't load levels. Is the backend running?</div>
      )}

      {!loading && !error && (
        <div className="levels-grid">
          {levels.map((lvl) => {
            const p = progress[lvl.index];
            const solved = !!p?.solved;
            return (
              <button
                key={lvl.index}
                className={[
                  "level-card",
                  `diff-${lvl.difficulty}`,
                  solved ? "solved" : "",
                ].join(" ")}
                onClick={() => navigate(`/play/${lvl.index}`)}
              >
                {solved && <span className="level-check">✓</span>}
                <span className="level-num">
                  {String(lvl.index + 1).padStart(2, "0")}
                </span>
                <span className="level-name">{lvl.name}</span>
                <span className="level-diff">{lvl.difficulty}</span>
                {solved && (
                  <span className="level-best">
                    {p.bestMoves} moves · {fmtTime(p.bestSeconds)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}