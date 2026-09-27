import "./App.css";
import { useGameState } from "./hooks/useGameState";
import { useTimer } from "./hooks/useTimer";
import { TopBar } from "./components/Layout/TopBar";
import { Footer } from "./components/Layout/Footer";
import { InfoPanel } from "./components/HUD/InfoPanel";
import { Board } from "./components/Board/Board";
import { ControlsPanel } from "./components/Controls/ControlsPanel";
import CongratsOverlay from "./components/Congrats/CongratsOverlay";
import ConnectionErrorOverlay from "./components/ConnectionError/ConnectionErrorOverlay";

function App() {
  const {
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
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    resetGame,
    retryConnection,
  } = useGameState();

  const isRunning = moves > 0 && !gameState?.is_won && !connectionError;
  const { seconds, reset: resetTimer } = useTimer(isRunning);

  const handleReset = async () => {
    resetTimer();
    await resetGame();
  };

  return (
    <div className="game-app">
      <TopBar
        level={4}
        online={!connectionError}
        onMenu={() => console.log("Menu — later")}
        onPrevLevel={() => console.log("Prev level — later")}
        onNextLevel={() => console.log("Next level — later")}
        onOpenLevels={() => console.log("Open levels — later")}
      />

      <main className="game-main">
        <InfoPanel selectedCar={selectedCar} moves={moves} seconds={seconds} />

        <Board
          gameState={gameState}
          initialLoading={initialLoading}
          selectedCar={selectedCar}
          hoveredCar={hoveredCar}
          onCellClick={handleCellClick}
          onCellEnter={handleMouseEnter}
          onCellLeave={handleMouseLeave}
          onSwipeUp={handleMoveUp}
          onSwipeDown={handleMoveDown}
          onSwipeLeft={handleMoveLeft}
          onSwipeRight={handleMoveRight}
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

      <Footer level={4} status={gameState?.is_won ? "SOLVED" : "READY"} />

      <CongratsOverlay
        isVisible={gameState?.is_won === true}
        onReset={handleReset}
      />

      <ConnectionErrorOverlay
        isVisible={connectionError}
        onRetry={retryConnection}
      />
    </div>
  );
}

export default App;