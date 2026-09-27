import "./InfoPanel.css";

interface InfoPanelProps {
  selectedCar: string;
  moves: number;
  seconds: number;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedCar,
  moves,
  seconds,
}) => {
  return (
    <aside className="info-panel">
      <div className="info-card objective-card">
        <div className="card-label">OBJECTIVE</div>
        <div className="objective-icon">🎯</div>
        <h2>Clear the exit</h2>
        <p>Move the cars and create a path for the red car.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">MOVES</span>
          <strong>{String(moves).padStart(2, "0")}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">TIME</span>
          <strong>{formatTime(seconds)}</strong>
        </div>
      </div>

      <div className="selected-card">
        <span className="card-label">SELECTED CAR</span>
        <div className="selected-car-display">
          <span className="selected-car-letter">{selectedCar || "—"}</span>
          <span>{selectedCar ? "Ready to move" : "Select a vehicle"}</span>
        </div>
      </div>
    </aside>
  );
};