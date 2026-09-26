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

  // useEffect(() => {
  //   if (hoveredCar) {
  //     console.log("Hovered car updated to:", hoveredCar);
  //   }
  // }, [hoveredCar]);

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
    <div className="container">
      <h1>🚗 Rush Hour Engine</h1>

      <div className="game-container">
        <div id="board" className="grid grid-cols-6 gap-1.5">
        {gameState?.board.map((row, ridx) =>
          row.map((cell, cidx) => (
            <div
              key={`${ridx}-${cidx}`}
              onClick={() => handleCellClick(cell)}
              onMouseEnter={() => handleMouseEnter(cell)}
              onMouseLeave={() => handleMouseLeave()}
              className={`flex items-center justify-center h-16 w-16 ${getCarColor(
                cell,
              )} ${cell === hoveredCar ? "brightness-125" : ""} ${showSelectedCar(cell, selectedCar,ridx, cidx, gameState.cars,)} text-white text-3xl font-bold rounded shadow`}
            >
              {cell !== "." && cell}
            </div>
          )),
        )}
      </div>
        <DPad
            onUp={handleMoveUp}
            onDown={handleMoveDown}
            onLeft={handleMoveLeft}
            onRight={handleMoveRight}
          />
      <div>
      </div>
      </div>
    </div>
  );
}

export default App;
