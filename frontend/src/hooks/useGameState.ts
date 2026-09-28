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

interface UseGameStateOptions {
  initialLevel?: number | null;
}

export const useGameState = (options?: UseGameStateOptions) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [hoveredCar, setHoveredCar] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  const initialLevel = options?.initialLevel ?? null;
  const loadedInitialRef = useRef(false);

  const loadInitialState = useCallback(async () => {
    setInitialLoading(true);
    try {
      const [state, levelList] = await Promise.all([
        getGameState(),
        getLevels(),
      ]);
      setLevels(levelList.levels);

      // Pick which level to show
      let target = state;
      if (
        initialLevel != null &&
        initialLevel >= 0 &&
        initialLevel < levelList.total &&
        initialLevel !== state.level
      ) {
        target = await postLoadLevel(initialLevel);
        setMoves(0);
      }
      setGameState(target);
      setConnectionError(false);
    } catch {
      setConnectionError(true);
    } finally {
      setInitialLoading(false);
    }
  }, [initialLevel]);

  // Initial fetch
  useEffect(() => {
    loadInitialState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-load when initialLevel changes (URL-driven navigation)
  useEffect(() => {
    if (!loadedInitialRef.current) {
      loadedInitialRef.current = true;
      return;
    }
    if (initialLevel == null) return;
    if (gameState?.level === initialLevel) return;
    (async () => {
      setActionLoading(true);
      setShowCongrats(false);
      try {
        const data = await postLoadLevel(initialLevel);
        setGameState(data);
        setSelectedCar("");
        setMoves(0);
        setConnectionError(false);
      } catch {
        setConnectionError(true);
      } finally {
        setActionLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevel]);

  // Congratulate on win
  useEffect(() => {
    if (gameState?.is_won && moves > 0) {
      setShowCongrats(true);
    } else {
      setShowCongrats(false);
    }
  }, [gameState?.is_won, moves]);

  // Auto-retry when backend is down
  useEffect(() => {
    if (!connectionError) return;
    const id = setInterval(loadInitialState, 5000);
    return () => clearInterval(id);
  }, [connectionError, loadInitialState]);

  // Persist level
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

  // Keyboard
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

  const handleMoveUp = useCallback((c: string) => sendMove(c, -1), [sendMove]);
  const handleMoveDown = useCallback((c: string) => sendMove(c, 1), [sendMove]);
  const handleMoveLeft = useCallback((c: string) => sendMove(c, -1), [sendMove]);
  const handleMoveRight = useCallback((c: string) => sendMove(c, 1), [sendMove]);

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
    if (gameState.level < gameState.total_levels - 1)
      loadLevel(gameState.level + 1);
  }, [gameState, loadLevel]);

  const retryConnection = useCallback(
    () => loadInitialState(),
    [loadInitialState]
  );

  return {
    gameState,
    levels,
    setLevels,
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