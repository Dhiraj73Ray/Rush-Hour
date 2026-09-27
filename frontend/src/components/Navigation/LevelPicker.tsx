import { type LevelInfo } from "../../types/game";
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
  if (!isOpen) return null;

  return (
    <div className="picker-backdrop" onClick={onClose}>
      <div className="picker-card" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h2>Select Level</h2>
          <button className="picker-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="picker-grid">
          {levels.map((lvl) => (
            <button
              key={lvl.index}
              className={[
                "picker-tile",
                `diff-${lvl.difficulty}`,
                lvl.index === currentIndex ? "active" : "",
              ].join(" ")}
              onClick={() => {
                onSelect(lvl.index);
                onClose();
              }}
            >
              <span className="tile-index">
                {String(lvl.index + 1).padStart(2, "0")}
              </span>
              <span className="tile-name">{lvl.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};