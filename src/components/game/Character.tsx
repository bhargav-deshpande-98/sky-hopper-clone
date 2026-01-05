import React, { memo } from 'react';

interface CharacterProps {
  x: number;
  y: number;
  rotation: number;
  propellerAngle: number;
}

export const Character = memo(({ x, y, rotation, propellerAngle }: CharacterProps) => {
  return (
    <div
      className="absolute pixel-perfect"
      style={{
        left: x - 20,
        top: y - 30,
        width: 40,
        height: 60,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {/* Propeller base */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          width: 8,
          height: 12,
          backgroundColor: 'hsl(var(--game-hammer-handle))',
          borderRadius: 2,
        }}
      />
      
      {/* Propeller blades */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: -2,
          transform: `translateX(-50%) rotate(${propellerAngle}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -18,
            top: -2,
            width: 36,
            height: 6,
            backgroundColor: 'hsl(var(--game-propeller))',
            borderRadius: 3,
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -3,
            top: -18,
            width: 6,
            height: 36,
            backgroundColor: 'hsl(var(--game-propeller))',
            borderRadius: 3,
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
          }}
        />
      </div>
      
      {/* Body/face */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 14,
          transform: 'translateX(-50%)',
          width: 32,
          height: 32,
          backgroundColor: 'hsl(var(--game-character-face))',
          borderRadius: 6,
          border: '3px solid hsl(var(--game-character-body))',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
        }}
      >
        {/* Left eye */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            top: 8,
            width: 8,
            height: 10,
            backgroundColor: 'white',
            borderRadius: 2,
            border: '2px solid hsl(var(--game-character-eyes))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 2,
              top: 3,
              width: 4,
              height: 4,
              backgroundColor: 'hsl(var(--game-character-eyes))',
              borderRadius: 1,
            }}
          />
        </div>
        
        {/* Right eye */}
        <div
          style={{
            position: 'absolute',
            right: 4,
            top: 8,
            width: 8,
            height: 10,
            backgroundColor: 'white',
            borderRadius: 2,
            border: '2px solid hsl(var(--game-character-eyes))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 2,
              top: 3,
              width: 4,
              height: 4,
              backgroundColor: 'hsl(var(--game-character-eyes))',
              borderRadius: 1,
            }}
          />
        </div>
        
        {/* Mouth/beak */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 4,
            transform: 'translateX(-50%)',
            width: 6,
            height: 4,
            backgroundColor: 'hsl(var(--game-hammer-handle))',
            borderRadius: 1,
          }}
        />
      </div>
      
      {/* Feet/legs */}
      <div
        className="absolute"
        style={{
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
        }}
      >
        <div
          style={{
            width: 10,
            height: 8,
            backgroundColor: 'hsl(var(--game-character-body))',
            borderRadius: '0 0 3px 3px',
          }}
        />
        <div
          style={{
            width: 10,
            height: 8,
            backgroundColor: 'hsl(var(--game-character-body))',
            borderRadius: '0 0 3px 3px',
          }}
        />
      </div>
    </div>
  );
});

Character.displayName = 'Character';
