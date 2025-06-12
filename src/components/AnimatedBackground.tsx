"use client";

import React, { useMemo, CSSProperties } from 'react';

// Simple seeded random number generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

interface Star {
  style: CSSProperties;
}

// Generate star positions and delays
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    style: {
      left: `${seededRandom(i * 3) * 100}%`,
      top: `${seededRandom(i * 3 + 1) * 100}%`,
      animationDelay: `${seededRandom(i * 3 + 2) * 5}s`,
    }
  }));
}

export default function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  const stars = useMemo(() => generateStars(100), []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Animated stars/particles */}
        <div className="stars">
          {stars.map((star, i) => (
            <div
              key={i}
              className="star"
              style={star.style}
            />
          ))}
        </div>
        
        {/* Gradient orb */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-orbit" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-orbit-reverse" />
      </div>
    </div>
  );
}
