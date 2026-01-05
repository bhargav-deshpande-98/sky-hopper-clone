import React, { memo } from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay = memo(({ score }: ScoreDisplayProps) => {
  return (
    <div
      className="absolute pixel-perfect game-shadow"
      style={{
        left: '50%',
        top: 40,
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        backgroundColor: 'hsl(var(--game-score-bg))',
        borderRadius: 8,
        border: '3px solid #333',
      }}
    >
      <span
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 24,
          color: 'hsl(var(--game-score-text))',
        }}
      >
        {score}
      </span>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';
