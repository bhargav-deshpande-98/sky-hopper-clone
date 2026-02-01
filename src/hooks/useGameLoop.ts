import { useCallback, useEffect, useRef, useState } from 'react';
import { initAudio, playTapSound, playScoreSound, playDeathSound } from '@/lib/sounds';

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
  scrollOffset: number;
}

interface Platform {
  id: number;
  y: number; // This is the base Y position, scrollOffset will be added
  gapX: number;
  gapWidth: number;
  hammerAngle: number;
  hammerDirection: 1 | -1;
  passed: boolean;
}

const GRAVITY_X = 0.25; // Slower horizontal acceleration (easier control)
const SCROLL_SPEED = 1.8; // Slower scroll speed (more time to react)
const MAX_VELOCITY_X = 5; // Lower max speed (easier to control)
const PLATFORM_SPACING = 200; // More space between platforms
const GAP_WIDTH = 110; // Much wider gap (easier to pass through)
const CHARACTER_WIDTH = 32;
const CHARACTER_HEIGHT = 50;
const HAMMER_SWING_SPEED = 0.03; // Slower hammer swing
const HAMMER_MAX_ANGLE = 0.5; // Smaller swing arc

export const useGameLoop = (screenWidth: number, screenHeight: number) => {
  const [gameState, setGameState] = useState<GameState>({
    characterX: screenWidth / 2,
    characterY: screenHeight * 0.65, // Character stays at 65% down the screen
    characterRotation: 0,
    velocityX: 0,
    direction: 1,
    propellerAngle: 0,
    platforms: [],
    score: 0,
    gameStatus: 'idle',
    scrollOffset: 0,
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
  
  const generatePlatform = useCallback((id: number, baseY: number): Platform => {
    const minGapX = 50;
    const maxGapX = screenWidth - GAP_WIDTH - 50;
    const gapX = minGapX + Math.random() * (maxGapX - minGapX);
    
    return {
      id,
      y: baseY,
      gapX,
      gapWidth: GAP_WIDTH,
      hammerAngle: (Math.random() - 0.5) * HAMMER_MAX_ANGLE,
      hammerDirection: Math.random() > 0.5 ? 1 : -1,
      passed: false,
    };
  }, [screenWidth]);
  
  const initializeGame = useCallback(() => {
    const platforms: Platform[] = [];
    // Generate platforms starting from above the character position going upward
    // First platform starts a bit above the character
    for (let i = 0; i < 8; i++) {
      // Negative Y means above the starting scroll position
      // These will appear above the character initially
      platforms.push(generatePlatform(i, -100 - i * PLATFORM_SPACING));
    }
    
    setGameState({
      characterX: screenWidth / 2,
      characterY: screenHeight * 0.65,
      characterRotation: 0,
      velocityX: 0,
      direction: Math.random() > 0.5 ? 1 : -1,
      propellerAngle: 0,
      platforms,
      score: 0,
      gameStatus: 'idle',
      scrollOffset: 0,
    });
  }, [screenWidth, screenHeight, generatePlatform]);
  
  const checkCollision = useCallback((
    charX: number,
    charY: number,
    platforms: Platform[],
    scrollOffset: number
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
      // Platform screen Y = platform.y + scrollOffset
      // As scrollOffset increases, platforms move DOWN the screen
      const platformScreenY = platform.y + scrollOffset;
      const platformTop = platformScreenY;
      const platformBottom = platformScreenY + 24;
      
      // Skip platforms not near the character
      if (platformBottom < charTop - 20 || platformTop > charBottom + 20) {
        continue;
      }
      
      // Check if character is at platform height
      if (charBottom > platformTop && charTop < platformBottom) {
        // Check if NOT in the gap (collision with platform bars)
        if (charRight < platform.gapX || charLeft > platform.gapX + platform.gapWidth) {
          return true;
        }
      }
      
      // Hammers removed for easier gameplay
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
    
    // Update propeller animation
    const newPropellerAngle = (state.propellerAngle + 35 * deltaTime) % 360;
    
    // Apply horizontal gravity (character swings left/right)
    let newVelocityX = state.velocityX + GRAVITY_X * state.direction * deltaTime;
    newVelocityX = Math.max(-MAX_VELOCITY_X, Math.min(MAX_VELOCITY_X, newVelocityX));
    
    // Update character X position
    const newCharacterX = state.characterX + newVelocityX * deltaTime;
    
    // Scroll offset increases = platforms move DOWN the screen
    const newScrollOffset = state.scrollOffset + SCROLL_SPEED * deltaTime;
    
    // Calculate character rotation based on velocity
    const newRotation = (newVelocityX / MAX_VELOCITY_X) * 25;
    
    // Update hammer swing animations
    let newPlatforms = state.platforms.map(p => {
      let newAngle = p.hammerAngle + HAMMER_SWING_SPEED * p.hammerDirection * deltaTime;
      let newDirection = p.hammerDirection;
      
      if (Math.abs(newAngle) > HAMMER_MAX_ANGLE) {
        newDirection = -p.hammerDirection as 1 | -1;
        newAngle = Math.sign(newAngle) * HAMMER_MAX_ANGLE;
      }
      
      return {
        ...p,
        hammerAngle: newAngle,
        hammerDirection: newDirection,
      };
    });
    
    // Check for score - when platform scrolls past the character
    let newScore = state.score;
    const charY = state.characterY;
    
    newPlatforms = newPlatforms.map(p => {
      const platformScreenY = p.y + newScrollOffset;
      // Platform passed when it goes below the character
      if (!p.passed && platformScreenY > charY) {
        newScore++;
        playScoreSound(newScore);
        return { ...p, passed: true };
      }
      return p;
    });
    
    // Remove platforms that are too far below screen and add new ones at top
    newPlatforms = newPlatforms.filter(p => {
      const platformScreenY = p.y + newScrollOffset;
      return platformScreenY < screenHeight + 100;
    });
    
    // Add new platforms at the top
    while (newPlatforms.length < 8) {
      const highestY = Math.min(...newPlatforms.map(p => p.y));
      newPlatforms.push(generatePlatform(
        Date.now() + Math.random() * 1000,
        highestY - PLATFORM_SPACING
      ));
    }
    
    // Check collision
    if (checkCollision(newCharacterX, charY, newPlatforms, newScrollOffset)) {
      // Game over
      playDeathSound();
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
      characterY: charY,
      characterRotation: newRotation,
      velocityX: newVelocityX,
      direction: state.direction,
      propellerAngle: newPropellerAngle,
      platforms: newPlatforms,
      score: newScore,
      gameStatus: 'playing',
      scrollOffset: newScrollOffset,
    });
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [screenHeight, checkCollision, generatePlatform, highScore]);
  
  const startGame = useCallback(() => {
    initAudio();
    initializeGame();
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'playing',
      }));
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, 50);
  }, [initializeGame, gameLoop]);
  
  const handleTap = useCallback(() => {
    if (gameStateRef.current.gameStatus === 'playing') {
      playTapSound();
      setGameState(prev => ({
        ...prev,
        direction: prev.direction === 1 ? -1 : 1,
        velocityX: prev.velocityX * 0.2, // Reduce velocity on direction change for snappier control
      }));
    }
  }, []);
  
  const restartGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    initAudio();
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
  
  return {
    gameState,
    highScore,
    startGame,
    handleTap,
    restartGame,
  };
};
