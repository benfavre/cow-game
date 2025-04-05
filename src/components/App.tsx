import React, { useState } from 'react';
import MainMenu from './../components/MainMenu';
import Game from './../components/Game';
import { GameScene } from '@/game/scenes/GameScene';

type GameState = 'menu' | 'playing' | 'gameOver';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentScene, setCurrentScene] = useState<GameScene | null>(null);

  const startGame = () => {
    setGameState('playing');
    // Initialize game scene here
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const restartGame = () => {
    setGameState('playing');
    // Reset game scene here
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="app-container">
      {gameState === 'menu' && <MainMenu onStartGame={startGame} />}
      {gameState === 'playing' && <Game onGameOver={endGame} />}
      {gameState === 'gameOver' && (
        <div className="game-over">
          <h1>Game Over</h1>
          <button onClick={restartGame}>Play Again</button>
          <button onClick={returnToMenu}>Main Menu</button>
        </div>
      )}
    </div>
  );
};

export default App; 