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

  const handleCellClick = useCallback((car: string) => {
    if (car !== "." && car !== selectedCar) {
      setSelectedCar(car);
      setGameState((prev) =>
        prev ? { ...prev, message: "", status: "ok" } : null
      );
    }
  }, [selectedCar]);

  const handleMouseEnter = useCallback((cell: string) => {
    if (cell === ".") return;
    setHoveredCar(cell);
  }, []);

  const handleMouseLeave = useCallback(() => setHoveredCar(null), []);

  const sendMove = useCallback(async (carId: string, move: number) => {
    if (!carId || move === 0) return;
    setActionLoading(true);
    setGameState((prev) =>
      prev ? { ...prev, message: "", status: "ok" } : null
    );
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
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedCar || !gameState) return;
      const car = gameState.cars[selectedCar];
      if (!car) return;

      const arrows = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (!arrows.includes(e.key)) return;

      e.preventDefault();

      if (car.direction === "H") {
        if (e.key === "ArrowLeft") sendMove(selectedCar, -1);
        else if (e.key === "ArrowRight") sendMove(selectedCar, 1);
      } else {
        if (e.key === "ArrowUp") sendMove(selectedCar, -1);
        else if (e.key === "ArrowDown") sendMove(selectedCar, 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCar, gameState, sendMove]);

  const handleMoveUp = useCallback(
    (car: string) => sendMove(car, -1),
    [sendMove]
  );
  const handleMoveDown = useCallback(
    (car: string) => sendMove(car, 1),
    [sendMove]
  );
  const handleMoveLeft = useCallback(
    (car: string) => sendMove(car, -1),
    [sendMove]
  );
  const handleMoveRight = useCallback(
    (car: string) => sendMove(car, 1),
    [sendMove]
  );

  const resetGame = useCallback(async () => {
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
  }, []);

  const retryConnection = useCallback(
    () => loadInitialState(),
    [loadInitialState]
  );

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