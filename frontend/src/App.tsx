import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { getCarColor, showSelectedCar } from "./utils/carHelpers";
import { DPad } from "./components/DPad";
import CongratsOverlay from "./components/Congrats/CongratsOverlay";

function App() {
  const {
    gameState,
    loading,
    status,
    selectedCar,
    handleCellClick,
    handleMouseEnter,
    handleMouseLeave,
    hoveredCar,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    resetGame,
  } = useGameState();

  return (
    <div className="container">
      <h1>🚗 Rush Hour Engine</h1>
      
      <div className="game-container">
        <div id="board" className="grid grid-cols-6 gap-1.5">
          {loading ? (
            Array(6).fill(null).map((_, ridx) =>
              Array(6).fill(null).map((_, cidx) => (
                <div
                  key={`loading-${ridx}-${cidx}`}
                  className="flex items-center justify-center h-16 w-16 bg-gray-700 text-white text-xl font-bold rounded shadow opacity-40 animate-pulse"
                >
                  Offline
                </div>
              ))
            )
          ) : (gameState?.board.map((row, ridx) =>
            row.map((cell, cidx) => (
              <div
                key={`${ridx}-${cidx}`}
                onClick={() => handleCellClick(cell)}
                onMouseEnter={() => handleMouseEnter(cell)}
                onMouseLeave={() => handleMouseLeave()}
                className={`flex items-center justify-center h-16 w-16 
              ${getCarColor(cell)} 
              ${cell === hoveredCar ? "brightness-125" : ""} 
              ${showSelectedCar(cell, selectedCar, ridx, cidx, gameState.cars)}
              ${gameState?.message === "Blocked by another car!" && cell === selectedCar ? "animate-collide" : ""}
              text-white text-3xl font-bold rounded shadow`}
              >
                {cell !== "." && cell}
              </div>
            )),
          ))}
        </div>

        <DPad
          selectedCar={selectedCar}
          loading={loading}
          gameState={gameState}
          onUp={handleMoveUp}
          onDown={handleMoveDown}
          onLeft={handleMoveLeft}
          onRight={handleMoveRight}
        />
        
        <div></div>
        <button onClick={() => resetGame()}>Reset</button>
      </div>

      {/* Renders when is_won is true. Resets and unmounts automatically when resetGame is called. */}
      <CongratsOverlay 
        isVisible={gameState?.is_won === true} 
        onReset={resetGame} 
      />
      {status.message && (
        <p style={{ color: status.color }}>{status.message}</p>
      )}
    </div>
  );
}

export default App;