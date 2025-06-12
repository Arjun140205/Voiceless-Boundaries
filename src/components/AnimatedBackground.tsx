"use client";

import React from 'react';

export default function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Animated stars/particles */}
        <div className="stars">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
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
