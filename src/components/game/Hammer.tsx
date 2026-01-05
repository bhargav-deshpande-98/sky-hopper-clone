import React, { memo } from 'react';

interface HammerProps {
  x: number;
  y: number;
  angle: number;
  side: 'left' | 'right';
}

export const Hammer = memo(({ x, y, angle, side }: HammerProps) => {
  const chainLength = 50;
  const hammerWidth = 24;
  const hammerHeight = 36;
  
  // Calculate hammer head position based on swing angle
  const hammerX = x + Math.sin(angle) * chainLength;
  const hammerY = y + Math.cos(angle) * chainLength;
  
  // Chain segments
  const chainSegments = 5;
  const segmentLength = chainLength / chainSegments;
  
  return (
    <div className="absolute pixel-perfect" style={{ left: 0, top: 0 }}>
      {/* Chain/rope segments */}
      {Array.from({ length: chainSegments }).map((_, i) => {
        const segX = x + Math.sin(angle) * (segmentLength * (i + 0.5));
        const segY = y + Math.cos(angle) * (segmentLength * (i + 0.5));
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: segX - 3,
              top: segY - 3,
              width: 6,
              height: 6,
              backgroundColor: '#333',
              borderRadius: '50%',
            }}
          />
        );
      })}
      
      {/* Hammer head */}
      <div
        className="absolute"
        style={{
          left: hammerX - hammerWidth / 2,
          top: hammerY,
          width: hammerWidth,
          height: hammerHeight,
          backgroundColor: 'hsl(var(--game-hammer))',
          borderRadius: 4,
          border: '2px solid #ddd',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
          transform: `rotate(${angle * (180 / Math.PI)}deg)`,
          transformOrigin: 'center top',
        }}
      >
        {/* Handle stripe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 8,
            transform: 'translateX(-50%)',
            width: 16,
            height: 4,
            backgroundColor: 'hsl(var(--game-hammer-handle))',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 8,
            transform: 'translateX(-50%)',
            width: 16,
            height: 4,
            backgroundColor: 'hsl(var(--game-hammer-handle))',
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
});

Hammer.displayName = 'Hammer';
