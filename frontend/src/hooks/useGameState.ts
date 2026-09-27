import { useState, useEffect, useCallback, useRef } from "react";
import { type GameState, type LevelInfo } from "../types/game";
import {
  getGameState,
  postMoveCar,
  postResetGame,
  getLevels,
  postLoadLevel,
} from "../api/gameApi";

const LEVEL_KEY = "rushhour.currentLevel";

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [hoveredCar, setHoveredCar] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  const didInit = useRef(false);

  const loadInitialState = useCallback(async () => {
    setInitialLoading(true);
    try {
      const [state, levelList] = await Promise.all([getGameState(), getLevels()]);
      setLevels(levelList.levels);

      // Restore saved level from localStorage (only on first mount)
      if (!didInit.current) {
        didInit.current = true;
        const saved = Number(localStorage.getItem(LEVEL_KEY));
        if (!Number.isNaN(saved) && saved >= 0 && saved < levelList.total && saved !== state.level) {
          const loaded = await postLoadLevel(saved);
          setGameState(loaded);
          setMoves(0);
          setConnectionError(false);
          return;
        }
      }

      setGameState(state);
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

  useEffect(() => {
    if (gameState?.is_won) {
      if (moves > 0) {
        setShowCongrats(true);
      }
    } else {
      setShowCongrats(false);
    }
  }, [gameState?.is_won, moves]);

  // Auto-retry while connection is down
  useEffect(() => {
    if (!connectionError) return;
    const id = setInterval(loadInitialState, 5000);
    return () => clearInterval(id);
  }, [connectionError, loadInitialState]);

  // Persist current level
  useEffect(() => {
    if (gameState && gameState.level >= 0) {
      localStorage.setItem(LEVEL_KEY, String(gameState.level));
    }
  }, [gameState?.level]);

  const loadLevel = useCallback(async (index: number) => {
    setActionLoading(true);
    setShowCongrats(false);
    try {
      const data = await postLoadLevel(index);
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

  const handleCellClick = useCallback(
    (car: string) => {
      if (car !== "." && car !== selectedCar) {
        setSelectedCar(car);
        setGameState((prev) =>
          prev ? { ...prev, message: "", status: "ok" } : null
        );
      }
    },
    [selectedCar]
  );

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

  const handleMoveUp = useCallback((car: string) => sendMove(car, -1), [sendMove]);
  const handleMoveDown = useCallback((car: string) => sendMove(car, 1), [sendMove]);
  const handleMoveLeft = useCallback((car: string) => sendMove(car, -1), [sendMove]);
  const handleMoveRight = useCallback((car: string) => sendMove(car, 1), [sendMove]);

  const resetGame = useCallback(async () => {
    setActionLoading(true);
    setShowCongrats(false);
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

  const goPrevLevel = useCallback(() => {
    if (!gameState) return;
    if (gameState.level > 0) loadLevel(gameState.level - 1);
  }, [gameState, loadLevel]);

  const goNextLevel = useCallback(() => {
    if (!gameState) return;
    if (gameState.level < gameState.total_levels - 1) loadLevel(gameState.level + 1);
  }, [gameState, loadLevel]);

  const retryConnection = useCallback(() => loadInitialState(), [loadInitialState]);

  return {
    gameState,
    levels,
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
    loadLevel,
    goPrevLevel,
    goNextLevel,
    retryConnection,
    showCongrats,
    setShowCongrats,
  };
};