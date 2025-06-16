"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  children: React.ReactNode;
  darkMode?: boolean;
}

type VantaEffect = {
  destroy: () => void;
} & Record<string, any>;

export default function AnimatedBackground({ children, darkMode = false }: Props) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);

  // Initialize Vanta effect
  useEffect(() => {
    let mounted = true;

    const initVanta = async () => {
      if (!vantaRef.current || vantaEffect) return;

      try {
        const VANTA = (await import('vanta/dist/vanta.fog.min')).default;
        if (!vantaRef.current || !mounted) return;

        const effect = VANTA({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0xef5f5,
          midtoneColor: 0xacff7,
          lowlightColor: 0x37ffd3,
          baseColor: darkMode ? 0x000000 : 0x000000,
          blurFactor: 0.21,
          speed: 3.20,
          zoom: 1.80
        });

        if (mounted) {
          setVantaEffect(effect);
        } else {
          effect.destroy();
        }
      } catch (error) {
        console.error('Failed to initialize Vanta effect:', error);
      }
    };

    initVanta();

    return () => {
      mounted = false;
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []);

  // Handle dark mode changes
  useEffect(() => {
    if (vantaEffect) {
      try {
        vantaEffect.setOptions({
          baseColor: darkMode ? 0x000000 : 0x000000,
        });
      } catch (error) {
        console.error('Failed to update Vanta effect:', error);
      }
    }
  }, [darkMode, vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10 w-full min-h-screen"
      aria-hidden="true"
    >
      <div className="relative z-0">{children}</div>
    </div>
  );
}
