import React, { memo } from 'react';

interface PlatformProps {
  y: number;
  gapX: number;
  gapWidth: number;
  screenWidth: number;
}

export const Platform = memo(({ y, gapX, gapWidth, screenWidth }: PlatformProps) => {
  const platformHeight = 24;
  const leftWidth = gapX;
  const rightWidth = screenWidth - gapX - gapWidth;
  
  const renderRivets = (width: number) => {
    const rivetCount = Math.floor(width / 24);
    return Array.from({ length: rivetCount }).map((_, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          left: 12 + i * 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 8,
          backgroundColor: 'hsl(var(--game-platform-rivet))',
          borderRadius: '50%',
          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.2)',
        }}
      />
    ));
  };
  
  return (
    <div className="absolute w-full" style={{ top: y }}>
      {/* Left platform */}
      <div
        className="absolute pixel-perfect"
        style={{
          left: 0,
          width: leftWidth,
          height: platformHeight,
          backgroundColor: 'hsl(var(--game-platform))',
          borderBottom: '4px solid hsl(var(--game-platform-dark))',
          boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
        }}
      >
        {renderRivets(leftWidth)}
      </div>
      
      {/* Right platform */}
      <div
        className="absolute pixel-perfect"
        style={{
          left: gapX + gapWidth,
          width: rightWidth,
          height: platformHeight,
          backgroundColor: 'hsl(var(--game-platform))',
          borderBottom: '4px solid hsl(var(--game-platform-dark))',
          boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
        }}
      >
        {renderRivets(rightWidth)}
      </div>
    </div>
  );
});

Platform.displayName = 'Platform';
