import React, { memo } from 'react';
import { Character } from './Character';

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
      className="absolute inset-0 flex flex-col items-center justify-center gap-8"
      onClick={onStart}
      style={{ cursor: 'pointer' }}
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
      
      <div className="relative" style={{ width: 60, height: 80 }}>
        <Character x={30} y={50} rotation={0} propellerAngle={propellerAngle} />
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
