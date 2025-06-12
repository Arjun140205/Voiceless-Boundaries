"use client";

import React from 'react';

const AnimatedBackground: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        {/* Gradient orbs with glass effect */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-orbit"
          style={{
            background: `linear-gradient(135deg, 
              var(--raspberry-rose) 0%,
              var(--soft-burgundy) 100%)`,
            opacity: 0.15
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-orbit-reverse"
          style={{
            background: `linear-gradient(135deg, 
              var(--pastel-pink) 0%,
              var(--muted-mauve) 100%)`,
            opacity: 0.15
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;
