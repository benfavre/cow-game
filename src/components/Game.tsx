import React, { useEffect, useRef } from 'react';
import { Stage, Container } from '@pixi/react';
import { initGame } from '@/game/GameManager';

interface GameProps {
  onGameOver: () => void;
}

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef(false);

  useEffect(() => {
    if (gameContainerRef.current && !gameInitialized.current) {
      // Initialize the game
      const cleanup = initGame(gameContainerRef.current, onGameOver);
      gameInitialized.current = true;

      // Cleanup when component unmounts
      return () => {
        cleanup();
        gameInitialized.current = false;
      };
    }
  }, [onGameOver]);

  return (
    <div ref={gameContainerRef} className="game-container">
      <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x1099bb }}>
        <Container></Container>
      </Stage>
    </div>
  );
};

export default Game; 