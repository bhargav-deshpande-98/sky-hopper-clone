import React, { memo } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = memo(({ onStart }: StartScreenProps) => {
  const [propellerAngle, setPropellerAngle] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPropellerAngle(prev => (prev + 30) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-50"
      onClick={onStart}
      style={{ cursor: 'pointer', backgroundColor: 'hsl(var(--game-sky) / 0.95)' }}
    >
      <h1
        className="pixel-perfect text-center"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 28,
          color: 'white',
          textShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          lineHeight: 1.4,
        }}
      >
        SWING<br />COPTERS
      </h1>
      
      {/* Animated character preview */}
      <div className="relative" style={{ width: 60, height: 80 }}>
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
              backgroundColor: 'white',
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
              backgroundColor: 'white',
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
            width: 40,
            height: 40,
            backgroundColor: '#fff8e7',
            borderRadius: 8,
            border: '4px solid hsl(var(--game-character-body))',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
          }}
        >
          {/* Left eye */}
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 10,
              width: 10,
              height: 12,
              backgroundColor: 'white',
              borderRadius: 3,
              border: '2px solid #222',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 3,
                top: 4,
                width: 5,
                height: 5,
                backgroundColor: '#222',
                borderRadius: 2,
              }}
            />
          </div>
          
          {/* Right eye */}
          <div
            style={{
              position: 'absolute',
              right: 4,
              top: 10,
              width: 10,
              height: 12,
              backgroundColor: 'white',
              borderRadius: 3,
              border: '2px solid #222',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 3,
                top: 4,
                width: 5,
                height: 5,
                backgroundColor: '#222',
                borderRadius: 2,
              }}
            />
          </div>
          
          {/* Mouth */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 5,
              transform: 'translateX(-50%)',
              width: 8,
              height: 5,
              backgroundColor: 'hsl(var(--game-hammer-handle))',
              borderRadius: 2,
            }}
          />
        </div>
        
        {/* Feet */}
        <div
          className="absolute"
          style={{
            left: '50%',
            bottom: 5,
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 12,
              height: 10,
              backgroundColor: 'hsl(var(--game-character-body))',
              borderRadius: '0 0 4px 4px',
            }}
          />
          <div
            style={{
              width: 12,
              height: 10,
              backgroundColor: 'hsl(var(--game-character-body))',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </div>
      </div>
      
      <div
        className="pixel-perfect animate-pulse"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 14,
          color: 'white',
          textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        }}
      >
        TAP TO START
      </div>
    </div>
  );
});

StartScreen.displayName = 'StartScreen';
