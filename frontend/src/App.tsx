import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { getCarColor, showSelectedCar } from "./utils/carHelpers";
import { DPad } from "./components/DPad";

function App() {
  const {
    gameState,
    selectedCar,
    handleCellClick,
    handleMouseEnter,
    handleMouseLeave,
    hoveredCar,
  } = useGameState();

  const handleMoveUp = () => {
    console.log("Move Up triggered");
  };

  const handleMoveDown = () => {
    console.log("Move Down triggered");
  };

  const handleMoveLeft = () => {
    console.log("Move Left triggered");
  };

  const handleMoveRight = () => {
    console.log("Move Right triggered");
  };

  return (
    <div className="game-app">

      {/* TOP BAR */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">🚗</div>

          <div>
            <div className="brand-name">RUSH HOUR</div>
            <div className="brand-subtitle">TRAFFIC PUZZLE</div>
          </div>
        </div>

        <div className="topbar-center">
          <span className="level-label">LEVEL</span>
          <span className="level-number">04</span>
        </div>

        <div className="online-status">
          <span className="online-dot" />
          ONLINE
        </div>

      </header>

      {/* MAIN GAME */}
      <main className="game-main">

        {/* LEFT HUD */}
        <aside className="game-info">

          <div className="info-card objective-card">
            <div className="card-label">OBJECTIVE</div>

            <div className="objective-icon">🎯</div>

            <h2>Clear the exit</h2>

            <p>
              Move the cars and create a path for the red car.
            </p>
          </div>

          <div className="stats-row">

            <div className="stat-card">
              <span className="stat-label">MOVES</span>
              <strong>12</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">TIME</span>
              <strong>01:24</strong>
            </div>

          </div>

          <div className="selected-card">

            <span className="card-label">
              SELECTED CAR
            </span>

            <div className="selected-car-display">
              <span className="selected-car-letter">
                {selectedCar || "—"}
              </span>

              <span>
                {selectedCar
                  ? "Ready to move"
                  : "Select a vehicle"}
              </span>
            </div>

          </div>

        </aside>

        {/* BOARD */}
        <section className="game-stage">

          <div className="stage-top">

            <div>
              <span className="stage-label">
                TRAFFIC GRID
              </span>

              <h1>Find the way out.</h1>
            </div>

            <div className="stage-badge">
              6 × 6
            </div>

          </div>

          <div className="board-frame">

            <div id="board" className="game-board">

              {gameState?.board.map((row, ridx) =>
                row.map((cell, cidx) => (
                  <div
                    key={`${ridx}-${cidx}`}
                    onClick={() => handleCellClick(cell)}
                    onMouseEnter={() =>
                      handleMouseEnter(cell)
                    }
                    onMouseLeave={() =>
                      handleMouseLeave()
                    }
                    className={`
                      board-cell
                      ${getCarColor(cell)}
                      ${
                        cell === hoveredCar
                          ? "cell-hovered"
                          : ""
                      }
                      ${showSelectedCar(
                        cell,
                        selectedCar,
                        ridx,
                        cidx,
                        gameState.cars
                      )}
                    `}
                  >
                    {cell !== "." && cell}
                  </div>
                ))
              )}

            </div>

            <div className="exit-indicator">
              EXIT
              <span>→</span>
            </div>

          </div>

        </section>

        {/* RIGHT CONTROLS */}
        <aside className="controls">

          <div className="controls-title">
            <span className="controller-symbol">⌁</span>

            <div>
              <strong>CONTROLS</strong>
              <span>MOVE VEHICLE</span>
            </div>
          </div>

          <DPad
            onUp={handleMoveUp}
            onDown={handleMoveDown}
            onLeft={handleMoveLeft}
            onRight={handleMoveRight}
          />

          <div className="keyboard-hint">
            <span>↑</span>
            <span>↓</span>
            <span>←</span>
            <span>→</span>
            <small>Keyboard</small>
          </div>

        </aside>

      </main>

      {/* FOOTER */}
      <footer className="game-footer">
        <span>RUSH HOUR ENGINE</span>
        <span>•</span>
        <span>PUZZLE 04</span>
        <span>•</span>
        <span>READY</span>
      </footer>

    </div>
  );
}

export default App;