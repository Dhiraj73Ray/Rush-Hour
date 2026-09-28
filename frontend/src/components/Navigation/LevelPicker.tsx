import { type LevelInfo } from "../../types/game";
import { useProgress } from "../../hooks/useProgress";
import "./LevelPicker.css";

interface LevelPickerProps {
  isOpen: boolean;
  levels: LevelInfo[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export const LevelPicker: React.FC<LevelPickerProps> = ({
  isOpen,
  levels,
  currentIndex,
  onSelect,
  onClose,
}) => {
  const { progress } = useProgress();

  if (!isOpen) return null;

  const solvedCount = levels.filter((l) => progress[l.index]?.solved).length;

  return (
    <div className="picker-backdrop" onClick={onClose}>
      <div className="picker-card" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h2>Select Level</h2>
          <span className="picker-progress">
            {solvedCount} / {levels.length}
          </span>
          <button className="picker-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="picker-grid">
          {levels.map((lvl) => {
            const p = progress[lvl.index];
            const solved = !!p?.solved;
            return (
              <button
                key={lvl.index}
                className={[
                  "picker-tile",
                  `diff-${lvl.difficulty}`,
                  lvl.index === currentIndex ? "active" : "",
                  solved ? "solved" : "",
                ].join(" ")}
                onClick={() => {
                  onSelect(lvl.index);
                  onClose();
                }}
              >
                {solved && <span className="tile-check">✓</span>}
                <span className="tile-index">
                  {String(lvl.index + 1).padStart(2, "0")}
                </span>
                <span className="tile-name">{lvl.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};