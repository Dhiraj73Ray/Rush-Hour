import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameState } from "../hooks/useGameState";
import { useTimer } from "../hooks/useTimer";
import { useProgress } from "../hooks/useProgress";
import { TopBar } from "../components/Layout/TopBar";
import { Footer } from "../components/Layout/Footer";
import { InfoPanel } from "../components/HUD/InfoPanel";
import { Board } from "../components/Board/Board";
import { ControlsPanel } from "../components/Controls/ControlsPanel";
import { LevelPicker } from "../components/Navigation/LevelPicker";
import CongratsOverlay from "../components/Congrats/CongratsOverlay";
import ConnectionErrorOverlay from "../components/ConnectionError/ConnectionErrorOverlay";
import "./GamePage.css";

const LEVEL_KEY = "rushhour.currentLevel";

export default function GamePage() {
  const { level: levelParam } = useParams();
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { recordSolve } = useProgress();

  // Decide which level to load: URL > localStorage > server default
  const initialLevel = useMemo(() => {
    if (levelParam) {
      const n = parseInt(levelParam, 10);
      if (!Number.isNaN(n)) return n;
    }
    const saved = localStorage.getItem(LEVEL_KEY);
    return saved != null ? Number(saved) : null;
  }, [levelParam]);

  const {
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
  } = useGameState({ initialLevel });

  const isRunning = moves > 0 && !gameState?.is_won && !connectionError;
  const { seconds, reset: resetTimer } = useTimer(isRunning);

  const handleReset = async () => {
    resetTimer();
    await resetGame();
  };

  const handleNextLevel = useCallback(() => {
    if (!gameState) return;
    const next = gameState.level + 1;
    if (next < gameState.total_levels) {
      navigate(`/play/${next}`);
    } else {
      navigate("/levels");
    }
  }, [gameState, navigate]);

  // Save progress + reset timer when a puzzle is solved
  useEffect(() => {
    if (gameState?.is_won && moves > 0 && gameState.level >= 0) {
      recordSolve(gameState.level, moves, seconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.is_won]);

  const currentLevel = (gameState?.level ?? 0) + 1;
  const totalLevels = gameState?.total_levels ?? 0;

  return (
    <div className="game-app">
      <TopBar
        level={currentLevel}
        totalLevels={totalLevels}
        online={!connectionError}
        canPrev={!!gameState && gameState.level > 0}
        canNext={!!gameState && gameState.level < totalLevels - 1}
        onMenu={() => navigate("/menu")}
        onPrevLevel={goPrevLevel}
        onNextLevel={goNextLevel}
        onOpenLevels={() => setPickerOpen(true)}
      />

      <main className="game-main">
        <InfoPanel selectedCar={selectedCar} moves={moves} seconds={seconds} />

        <Board
          gameState={gameState}
          initialLoading={initialLoading}
          disabled={actionLoading}
          selectedCar={selectedCar}
          hoveredCar={hoveredCar}
          onCellClick={handleCellClick}
          onCellEnter={handleMouseEnter}
          onCellLeave={handleMouseLeave}
          onMove={sendMove}
        />

        <ControlsPanel
          selectedCar={selectedCar}
          loading={actionLoading}
          gameState={gameState}
          onUp={handleMoveUp}
          onDown={handleMoveDown}
          onLeft={handleMoveLeft}
          onRight={handleMoveRight}
          onReset={handleReset}
        />
      </main>

      <Footer
        level={currentLevel}
        status={gameState?.is_won ? "SOLVED" : "READY"}
      />

      <LevelPicker
        isOpen={pickerOpen}
        levels={levels}
        currentIndex={gameState?.level ?? 0}
        onSelect={(i) => {
          loadLevel(i);
          navigate(`/play/${i}`, { replace: true });
        }}
        onClose={() => setPickerOpen(false)}
      />

      <CongratsOverlay
        isVisible={showCongrats}
        onReset={handleReset}
        onNext={handleNextLevel}
        onClose={() => setShowCongrats(false)}
      />

      <ConnectionErrorOverlay
        isVisible={connectionError}
        onRetry={retryConnection}
      />
    </div>
  );
}