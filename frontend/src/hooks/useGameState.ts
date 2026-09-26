import { useState, useEffect } from "react";
import { type GameState } from "../types/game";
import { getGameState, postMoveCar } from "../api/gameApi";

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
    console.log("Move Down triggered");
  };

  const handleMoveDown = (selectedCar: string) => {
    console.log("Move Down triggered");
  };

  const handleMoveLeft = (selectedCar: string) => {
    console.log("Move Left triggered");
  };

  const handleMoveRight = (selectedCar: string) => {
    console.log("Move Right triggered");
  };

  const sendMove = async (selectedCar: string, move: number) => {
    try {
        const result = await postMoveCar({ car_id: selectedCar, steps: move });
        console.log(result);
      } catch (err) {
        setStatus({
          message: "❌ Cannot connect to backend server!",
          color: "#e84118",
        });
      }
    try {
        const data = await getGameState();
        setGameState(data);
      } catch (err) {
        setStatus({
          message: "❌ Cannot connect to backend server!",
          color: "#e84118",
        });
      }
  };

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
  };
};
