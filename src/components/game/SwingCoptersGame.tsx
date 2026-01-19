import React, { useEffect, useRef, useState } from 'react';
import { Character } from './Character';
import { Platform } from './Platform';
import { Hammer } from './Hammer';
import { Cloud } from './Cloud';
import { ScoreDisplay } from './ScoreDisplay';
import { GameOver } from './GameOver';
import { StartScreen } from './StartScreen';
import { useGameLoop } from '@/hooks/useGameLoop';

export const SwingCoptersGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 360, height: 640 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Math.min(window.innerWidth, 420),
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  const { gameState, highScore, startGame, handleTap, restartGame } = useGameLoop(
    dimensions.width,
    dimensions.height
  );
  
  // Generate clouds for parallax background
  const clouds = React.useMemo(() => [
    { x: 20, y: 100, scale: 0.8 },
    { x: dimensions.width - 150, y: 250, scale: 1 },
    { x: 50, y: 450, scale: 0.6 },
    { x: dimensions.width - 120, y: 550, scale: 0.9 },
    { x: 30, y: 700, scale: 0.7 },
  ], [dimensions.width]);
  
  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (gameState.gameStatus === 'idle') {
      startGame();
    } else if (gameState.gameStatus === 'playing') {
      handleTap();
    }
  };
  
  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden mx-auto"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 'hsl(var(--game-sky))',
        touchAction: 'none',
      }}
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
    >
      {/* Clouds (slow parallax - clouds move down slower than platforms) */}
      {clouds.map((cloud, i) => (
        <Cloud
          key={i}
          x={cloud.x}
          y={(cloud.y + gameState.scrollOffset * 0.2) % (dimensions.height + 100)}
          scale={cloud.scale}
        />
      ))}
      
      {/* Only render game elements when not on start screen */}
      {gameState.gameStatus !== 'idle' && (
        <>
          {/* Platforms and Hammers - they scroll DOWN as scrollOffset increases */}
          {gameState.platforms.map(platform => {
            const screenY = platform.y + gameState.scrollOffset;
            
            // Only render platforms that are on screen
            if (screenY < -100 || screenY > dimensions.height + 100) return null;
            
            return (
              <React.Fragment key={platform.id}>
                <Platform
                  y={screenY}
                  gapX={platform.gapX}
                  gapWidth={platform.gapWidth}
                  screenWidth={dimensions.width}
                />
                {/* Hammers removed for easier gameplay */}
              </React.Fragment>
            );
          })}
          
          {/* Character - stays at fixed vertical position, moves horizontally */}
          <Character
            x={gameState.characterX}
            y={gameState.characterY}
            rotation={gameState.characterRotation}
            propellerAngle={gameState.propellerAngle}
          />
        </>
      )}
      
      {/* UI Elements */}
      {gameState.gameStatus === 'playing' && (
        <ScoreDisplay score={gameState.score} />
      )}
      
      {gameState.gameStatus === 'idle' && (
        <StartScreen onStart={startGame} />
      )}
      
      {gameState.gameStatus === 'gameover' && (
        <GameOver
          score={gameState.score}
          highScore={highScore}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};
