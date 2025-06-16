declare module 'vanta/dist/vanta.waves.min' {
  interface VantaWavesOptions {
    el: HTMLElement | null;
    THREE: any;
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    scale: number;
    scaleMobile: number;
    color: number;
    shininess: number;
    waveHeight: number;
    waveSpeed: number;
    zoom: number;
  }

  function waves(options: VantaWavesOptions): {
    destroy: () => void;
  };

  export default waves;
}

declare module 'vanta/dist/vanta.dots.min' {
  interface VantaDotsOptions {
    el: HTMLElement | null;
    THREE: any;
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    scale: number;
    scaleMobile: number;
    color: number;
    color2: number;
    backgroundColor: number;
    size: number;
    spacing: number;
    showLines: boolean;
  }

  function dots(options: VantaDotsOptions): {
    destroy: () => void;
  };

  export default dots;
}
