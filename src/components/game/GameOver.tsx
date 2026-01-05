import React, { memo } from 'react';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOver = memo(({ score, highScore, onRestart }: GameOverProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 100,
      }}
    >
      <div
        className="pixel-perfect game-shadow flex flex-col items-center gap-6 p-8"
        style={{
          backgroundColor: 'hsl(var(--game-score-bg))',
          borderRadius: 12,
          border: '4px solid #333',
        }}
      >
        <h2
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 20,
            color: 'hsl(var(--game-score-text))',
          }}
        >
          GAME OVER
        </h2>
        
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 12,
                color: '#666',
              }}
            >
              SCORE
            </span>
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 18,
                color: 'hsl(var(--game-score-text))',
              }}
            >
              {score}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 12,
                color: '#666',
              }}
            >
              BEST
            </span>
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: 18,
                color: 'hsl(var(--game-character-body))',
              }}
            >
              {highScore}
            </span>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="pixel-perfect game-shadow transition-transform active:scale-95"
          style={{
            padding: '16px 32px',
            backgroundColor: 'hsl(var(--game-platform))',
            borderRadius: 8,
            border: '3px solid hsl(var(--game-platform-dark))',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: 14,
              color: 'white',
            }}
          >
            TAP TO RETRY
          </span>
        </button>
      </div>
    </div>
  );
});

GameOver.displayName = 'GameOver';
