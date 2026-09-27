import { useState, useEffect, useCallback } from "react";
import { type GameState } from "../types/game";
import { getGameState, postMoveCar, postResetGame } from "../api/gameApi";

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [hoveredCar, setHoveredCar] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);

  const loadInitialState = useCallback(async () => {
    setInitialLoading(true);
    try {
      const data = await getGameState();
      setGameState(data);
      setConnectionError(false);
    } catch {
      setConnectionError(true);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  // Auto-retry every 5s while connection is down
  useEffect(() => {
    if (!connectionError) return;
    const id = setInterval(loadInitialState, 5000);
    return () => clearInterval(id);
  }, [connectionError, loadInitialState]);

  const handleCellClick = (car: string) => {
    if (car !== "." && car !== selectedCar) {
      setSelectedCar(car);
      setGameState((prev) => (prev ? { ...prev, message: "", status: "ok" } : null));
    }
  };

  const handleMouseEnter = (cell: string) => {
    if (cell === ".") return;
    setHoveredCar(cell);
  };

  const handleMouseLeave = () => setHoveredCar(null);

  const sendMove = async (carId: string, move: number) => {
    if (!carId) return;
    setActionLoading(true);
    setGameState((prev) => (prev ? { ...prev, message: "", status: "ok" } : null));
    try {
      const data = await postMoveCar({ car_id: carId, steps: move });
      setGameState(data);
      if (data.status === "ok") setMoves((m) => m + 1);
      setConnectionError(false);
    } catch {
      setConnectionError(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveUp = (car: string) => sendMove(car, -1);
  const handleMoveDown = (car: string) => sendMove(car, 1);
  const handleMoveLeft = (car: string) => sendMove(car, -1);
  const handleMoveRight = (car: string) => sendMove(car, 1);

  const resetGame = async () => {
    setActionLoading(true);
    try {
      const data = await postResetGame();
      setGameState(data);
      setSelectedCar("");
      setMoves(0);
      setConnectionError(false);
    } catch {
      setConnectionError(true);
    } finally {
      setActionLoading(false);
    }
  };

  const retryConnection = () => loadInitialState();

  return {
    gameState,
    initialLoading,
    actionLoading,
    connectionError,
    selectedCar,
    moves,
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
    retryConnection,
  };
};