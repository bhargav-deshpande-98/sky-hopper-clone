import React, { memo } from 'react';

interface CloudProps {
  x: number;
  y: number;
  scale?: number;
}

export const Cloud = memo(({ x, y, scale = 1 }: CloudProps) => {
  return (
    <div
      className="absolute pixel-perfect"
      style={{
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Cloud shape made of overlapping circles */}
      <div
        style={{
          position: 'relative',
          width: 120,
          height: 60,
        }}
      >
        <div
          className="absolute"
          style={{
            left: 0,
            top: 20,
            width: 40,
            height: 40,
            backgroundColor: 'hsl(var(--game-cloud))',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 25,
            top: 10,
            width: 50,
            height: 50,
            backgroundColor: 'hsl(var(--game-cloud))',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 60,
            top: 5,
            width: 45,
            height: 45,
            backgroundColor: 'hsl(var(--game-cloud))',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 80,
            top: 20,
            width: 40,
            height: 40,
            backgroundColor: 'hsl(var(--game-cloud))',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
});

Cloud.displayName = 'Cloud';
