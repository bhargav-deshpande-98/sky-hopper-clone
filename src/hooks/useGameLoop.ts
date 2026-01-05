import { useCallback, useEffect, useRef, useState } from 'react';

interface GameState {
  characterX: number;
  characterY: number;
  characterRotation: number;
  velocityX: number;
  direction: 1 | -1;
  propellerAngle: number;
  platforms: Platform[];
  score: number;
  gameStatus: 'idle' | 'playing' | 'gameover';
  cameraY: number;
}

interface Platform {
  id: number;
  y: number;
  gapX: number;
  gapWidth: number;
  hammerAngle: number;
  hammerDirection: 1 | -1;
  passed: boolean;
}

const GRAVITY_X = 0.3;
const RISE_SPEED = 3;
const MAX_VELOCITY_X = 6;
const PLATFORM_SPACING = 200;
const GAP_WIDTH = 70;
const CHARACTER_WIDTH = 32;
const CHARACTER_HEIGHT = 50;
const HAMMER_SWING_SPEED = 0.04;
const HAMMER_MAX_ANGLE = 0.8;

export const useGameLoop = (screenWidth: number, screenHeight: number) => {
  const [gameState, setGameState] = useState<GameState>({
    characterX: screenWidth / 2,
    characterY: screenHeight - 150,
    characterRotation: 0,
    velocityX: 0,
    direction: 1,
    propellerAngle: 0,
    platforms: [],
    score: 0,
    gameStatus: 'idle',
    cameraY: 0,
  });
  
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('swingcopters-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const gameStateRef = useRef(gameState);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  const generatePlatform = useCallback((id: number, y: number): Platform => {
    const minGapX = 60;
    const maxGapX = screenWidth - GAP_WIDTH - 60;
    const gapX = minGapX + Math.random() * (maxGapX - minGapX);
    
    return {
      id,
      y,
      gapX,
      gapWidth: GAP_WIDTH,
      hammerAngle: Math.random() * HAMMER_MAX_ANGLE - HAMMER_MAX_ANGLE / 2,
      hammerDirection: Math.random() > 0.5 ? 1 : -1,
      passed: false,
    };
  }, [screenWidth]);
  
  const initializeGame = useCallback(() => {
    const platforms: Platform[] = [];
    for (let i = 0; i < 6; i++) {
      platforms.push(generatePlatform(i, screenHeight - 300 - i * PLATFORM_SPACING));
    }
    
    setGameState({
      characterX: screenWidth / 2,
      characterY: screenHeight - 150,
      characterRotation: 0,
      velocityX: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      propellerAngle: 0,
      platforms,
      score: 0,
      gameStatus: 'idle',
      cameraY: 0,
    });
  }, [screenWidth, screenHeight, generatePlatform]);
  
  const checkCollision = useCallback((
    charX: number,
    charY: number,
    platforms: Platform[],
    cameraY: number
  ): boolean => {
    const charLeft = charX - CHARACTER_WIDTH / 2;
    const charRight = charX + CHARACTER_WIDTH / 2;
    const charTop = charY - CHARACTER_HEIGHT / 2;
    const charBottom = charY + CHARACTER_HEIGHT / 2;
    
    // Check wall collision
    if (charLeft < 0 || charRight > screenWidth) {
      return true;
    }
    
    // Check platform collision
    for (const platform of platforms) {
      const platformScreenY = platform.y - cameraY;
      const platformTop = platformScreenY;
      const platformBottom = platformScreenY + 24;
      
      // Check if character is at platform height
      if (charBottom > platformTop && charTop < platformBottom) {
        // Check if NOT in the gap
        if (charRight < platform.gapX || charLeft > platform.gapX + platform.gapWidth) {
          return true;
        }
        
        // Check hammer collision
        const hammerX = platform.gapX + platform.gapWidth / 2 + Math.sin(platform.hammerAngle) * 50;
        const hammerY = platformScreenY + 50 + Math.cos(platform.hammerAngle) * 50;
        const hammerWidth = 24;
        const hammerHeight = 36;
        
        const hammerLeft = hammerX - hammerWidth / 2;
        const hammerRight = hammerX + hammerWidth / 2;
        const hammerTop = hammerY;
        const hammerBottom = hammerY + hammerHeight;
        
        if (
          charRight > hammerLeft &&
          charLeft < hammerRight &&
          charBottom > hammerTop &&
          charTop < hammerBottom
        ) {
          return true;
        }
      }
    }
    
    return false;
  }, [screenWidth]);
  
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
    lastTimeRef.current = timestamp;
    
    const state = gameStateRef.current;
    
    if (state.gameStatus !== 'playing') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Update propeller
    const newPropellerAngle = (state.propellerAngle + 30 * deltaTime) % 360;
    
    // Apply horizontal gravity
    let newVelocityX = state.velocityX + GRAVITY_X * state.direction * deltaTime;
    newVelocityX = Math.max(-MAX_VELOCITY_X, Math.min(MAX_VELOCITY_X, newVelocityX));
    
    // Update position
    const newCharacterX = state.characterX + newVelocityX * deltaTime;
    
    // Camera follows character going up
    const targetCameraY = Math.max(0, (screenHeight - 150 - state.characterY) + state.cameraY);
    const newCameraY = state.cameraY + RISE_SPEED * deltaTime;
    
    // Character stays roughly centered vertically, camera moves up
    const newCharacterY = screenHeight - 150;
    
    // Calculate character rotation based on velocity
    const newRotation = (newVelocityX / MAX_VELOCITY_X) * 20;
    
    // Update platforms (move them down relative to camera, add new ones)
    let newPlatforms = state.platforms.map(p => ({
      ...p,
      hammerAngle: p.hammerAngle + HAMMER_SWING_SPEED * p.hammerDirection * deltaTime,
      hammerDirection: Math.abs(p.hammerAngle) > HAMMER_MAX_ANGLE 
        ? -p.hammerDirection as 1 | -1
        : p.hammerDirection,
    }));
    
    // Check for score
    let newScore = state.score;
    newPlatforms = newPlatforms.map(p => {
      const platformScreenY = p.y - newCameraY;
      if (!p.passed && platformScreenY > newCharacterY) {
        return { ...p, passed: true };
      }
      return p;
    });
    
    const passedPlatforms = newPlatforms.filter(p => p.passed).length;
    if (passedPlatforms > state.score) {
      newScore = passedPlatforms;
    }
    
    // Remove platforms that are too far below and add new ones at top
    const highestPlatform = Math.min(...newPlatforms.map(p => p.y));
    newPlatforms = newPlatforms.filter(p => p.y - newCameraY < screenHeight + 100);
    
    while (newPlatforms.length < 6) {
      const lowestY = Math.min(...newPlatforms.map(p => p.y));
      newPlatforms.push(generatePlatform(
        Date.now() + Math.random(),
        lowestY - PLATFORM_SPACING
      ));
    }
    
    // Check collision
    if (checkCollision(newCharacterX, newCharacterY, newPlatforms, newCameraY)) {
      // Game over
      const finalScore = newScore;
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('swingcopters-highscore', finalScore.toString());
      }
      
      setGameState(prev => ({
        ...prev,
        gameStatus: 'gameover',
        score: finalScore,
      }));
      return;
    }
    
    setGameState({
      characterX: newCharacterX,
      characterY: newCharacterY,
      characterRotation: newRotation,
      velocityX: newVelocityX,
      direction: state.direction,
      propellerAngle: newPropellerAngle,
      platforms: newPlatforms,
      score: newScore,
      gameStatus: 'playing',
      cameraY: newCameraY,
    });
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [screenHeight, checkCollision, generatePlatform, highScore]);
  
  const startGame = useCallback(() => {
    initializeGame();
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing',
    }));
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [initializeGame, gameLoop]);
  
  const handleTap = useCallback(() => {
    if (gameStateRef.current.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        direction: prev.direction === 1 ? -1 : 1,
        velocityX: prev.velocityX * 0.3, // Reduce velocity on direction change
      }));
    }
  }, []);
  
  const restartGame = useCallback(() => {
    initializeGame();
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'playing',
      }));
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, 100);
  }, [initializeGame, gameLoop]);
  
  useEffect(() => {
    initializeGame();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeGame]);
  
  // Start the game loop when status changes to playing
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && !animationFrameRef.current) {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameState.gameStatus !== 'playing' && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [gameState.gameStatus, gameLoop]);
  
  return {
    gameState,
    highScore,
    startGame,
    handleTap,
    restartGame,
  };
};
