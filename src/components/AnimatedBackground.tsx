"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  children: React.ReactNode;
  darkMode?: boolean;
}

export default function AnimatedBackground({ children, darkMode = false }: Props) {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVanta = async () => {
      if (!vantaEffect && vantaRef.current) {
        const VANTA = (await import('vanta/dist/vanta.fog.min')).default;
        setVantaEffect(
          VANTA({
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
            baseColor: 0x0,
            blurFactor: 0.21,
            speed: 4.40,
            zoom: 1.80
          })
        );
      }
    };

    // Load Vanta effect
    loadVanta();

    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, darkMode]);

  return (
    <div ref={vantaRef} className="min-h-screen w-full fixed top-0 left-0 -z-10">
      <div className="relative z-0">{children}</div>
    </div>
  );
}
