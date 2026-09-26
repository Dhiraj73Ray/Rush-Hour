import { useState, useEffect } from "react";
import { type GameState } from "../types/game";
import { getGameState, postMoveCar, postResetGame } from "../api/gameApi";

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; color: string }>({
    message: "",
    color: "",
  });
  const [hoveredCar, setHoveredCar] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      setLoading(true)
      try {
        const data = await getGameState();
        setGameState(data);
        setLoading(false)
      } catch (err) {
        setStatus({
          message: "❌ Cannot connect to backend server!",
          color: "#e84118",
        });
      }
    };
    loadInitialState();
  }, []);
  const handleCellClick = (car: string) => {
    if (car != "." && car != selectedCar) {
      // console.log(cell_id, car)
      setSelectedCar(car);
    }
  };

  const handleMouseEnter = (cell: string) => {
    if (cell === ".") return; // Skip empty board slots
    setHoveredCar(cell);
  };

  const handleMouseLeave = () => setHoveredCar(null);


  const handleMoveUp = (selectedCar: string) => {
    sendMove(selectedCar, -1);
  };

  const handleMoveDown = (selectedCar: string) => {
    sendMove(selectedCar, 1);
  };

  const handleMoveLeft = (selectedCar: string) => {
    sendMove(selectedCar, -1);
  };

  const handleMoveRight = (selectedCar: string) => {
    sendMove(selectedCar, 1);
  };

  const sendMove = async (selectedCar: string, move: number) => {
    if (!selectedCar) return;
    setLoading(true);
    try {
        const data = await postMoveCar({ car_id: selectedCar, steps: move });
        // const data = await getGameState();
        setGameState(data);
        setStatus({ message: "", color: "" }); 
      } catch (err) {
        setStatus({
          message: "❌ Cannot connect to backend server!",
          color: "#e84118",
        });
      }finally{
        setLoading(false)
      }
  };

  const resetGame = async () => {
    setLoading(true);
    try {
        const data = await postResetGame();
        // const data = await getGameState();
        setGameState(data);
        setSelectedCar("")
        setStatus({ message: "Game Reset", color: "" }); 
      } catch (err) {
        setStatus({
          message: "❌ Cannot connect to backend server!",
          color: "#e84118",
        });
      }finally{
        setLoading(false)
      }
  }

  return {
    gameState,
    status,
    loading,
    setStatus,
    selectedCar,
    handleCellClick,
    handleMouseEnter,
    handleMouseLeave,
    hoveredCar,
    sendMove,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    resetGame,
  };
};
