import { type GameState } from "../../types/game";
import { DPad } from "./DPad";
import { KeyboardHint } from "./KeyboardHint";
import "./ControlsPanel.css";

interface ControlsPanelProps {
  selectedCar: string;
  loading: boolean;
  gameState: GameState | null;
  onUp: (car: string) => void;
  onDown: (car: string) => void;
  onLeft: (car: string) => void;
  onRight: (car: string) => void;
  onReset: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  selectedCar,
  loading,
  gameState,
  onUp,
  onDown,
  onLeft,
  onRight,
  onReset,
}) => {
  return (
    <aside className="controls-panel">
      <div className="controls-title">
        <span className="controller-symbol">⌁</span>
        <div>
          <strong>CONTROLS</strong>
          <span>MOVE VEHICLE</span>
        </div>
      </div>

      <DPad
        selectedCar={selectedCar}
        loading={loading}
        gameState={gameState}
        onUp={onUp}
        onDown={onDown}
        onLeft={onLeft}
        onRight={onRight}
      />

      <KeyboardHint />

      <button className="reset-btn" onClick={onReset}>
        RESET PUZZLE
      </button>
    </aside>
  );
};