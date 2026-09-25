import "./App.css"
import { useGameState } from "./hooks/useGameState";
import { getCarColor, showSelectedCar } from "./utils/carHelpers";


function App(){

  const { gameState, status, setStatus, selectedCar, handleCellClick } = useGameState()


  return(
    <>
      <div className="container">
        <h1 className="">🚗 Rush Hour Engine</h1>

        <div id="board" className="grid grid-cols-6 gap-1.5">
          {gameState?.board.map((row, ridx) => (
            row.map((cell, cidx) => (
              <div
                key={`${ridx}-${cidx}`}
                onClick={() => handleCellClick(`${ridx}-${cidx}`, cell)}
                className={`flex items-center justify-center h-16 w-16 ${getCarColor(cell)} ${showSelectedCar(cell, selectedCar)} text-white text-3xl font-bold rounded shadow`}
              >
                {cell !== "." && cell}
              </div>
            ))
          ))}
        </div>

      </div>
    </>
  )
}



export default App