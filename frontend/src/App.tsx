import { useState } from "react";
import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { useTimer } from "./hooks/useTimer";
import { TopBar } from "./components/Layout/TopBar";
import { Footer } from "./components/Layout/Footer";
import { InfoPanel } from "./components/HUD/InfoPanel";
import { Board } from "./components/Board/Board";
import { ControlsPanel } from "./components/Controls/ControlsPanel";
import { LevelPicker } from "./components/Navigation/LevelPicker";
import CongratsOverlay from "./components/Congrats/CongratsOverlay";
import ConnectionErrorOverlay from "./components/ConnectionError/ConnectionErrorOverlay";

function App() {
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
  } = useGameState();

  const [pickerOpen, setPickerOpen] = useState(false);

  const isRunning = moves > 0 && !gameState?.is_won && !connectionError;
  const { seconds, reset: resetTimer } = useTimer(isRunning);

  const handleReset = async () => {
    resetTimer();
    await resetGame();
  };

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
        onMenu={() => console.log("Menu — later")}
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

      <Footer level={currentLevel} status={gameState?.is_won ? "SOLVED" : "READY"} />

      <LevelPicker
        isOpen={pickerOpen}
        levels={levels}
        currentIndex={gameState?.level ?? 0}
        onSelect={loadLevel}
        onClose={() => setPickerOpen(false)}
      />

      <CongratsOverlay
        isVisible={showCongrats}
        onReset={handleReset}
        onClose={() => setShowCongrats(false)}
      />

      <ConnectionErrorOverlay
        isVisible={connectionError}
        onRetry={retryConnection}
      />
    </div>
  );
}

export default App;