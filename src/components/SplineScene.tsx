'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import type { Application } from '@splinetool/runtime';

// ── Load Spline with no SSR (avoids async Client Component error in Next.js 15)
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <SplineLoader />,
});

// ── Loading Indicator ────────────────────────────────────────────────────────
function SplineLoader() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
      <div className="relative w-12 h-12 flex items-center justify-center mb-3">
        <div className="absolute inset-0 border border-black/15 rounded-full animate-ping opacity-40" />
        <div className="absolute inset-0 border-2 border-t-black border-r-black/30 border-b-black/10 border-l-transparent rounded-full animate-spin" />
      </div>
      <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500 font-semibold">
        Loading 3D Asset...
      </p>
    </div>
  );
}

// ── WebGL Support Check ──────────────────────────────────────────────────────
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className = '' }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
  }, []);

  const handleLoad = useCallback((splineApp: Application) => {
    setIsLoaded(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderer = (splineApp as any)._renderer;
      if (renderer?.setClearColor) {
        renderer.setClearColor(0xffffff, 0);
        renderer.setClearAlpha(0);
      }
      // Scale camera zoom balanced (1.16x) so it fits perfectly without clipping
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const camera = (splineApp as any)._camera;
      if (camera) {
        camera.zoom = 1.16;
        if (camera.updateProjectionMatrix) camera.updateProjectionMatrix();
      }
    } catch {
      // ignore – private API
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center border border-black/5 rounded-3xl bg-neutral-50 p-8 text-center select-none ${className}`}>
        <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mb-4 border border-black/10 shadow-inner">
          <span className="text-2xl animate-pulse">✨</span>
        </div>
        <h3 className="text-xs font-mono text-neutral-800 tracking-[0.2em] uppercase mb-1.5 font-bold">
          Interactive 3D Experience
        </h3>
        <p className="text-[11px] text-neutral-500 max-w-xs font-mono leading-relaxed">
          Your device or browser does not support WebGL hardware acceleration.
        </p>
      </div>
    );
  }

  const isIframeUrl = scene.includes('my.spline.design') || !scene.includes('.splinecode');

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-white ${className}`}>
      {!isLoaded && <SplineLoader />}
      <div className={`w-full h-full flex items-center justify-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {isIframeUrl ? (
          <iframe
            src={scene}
            frameBorder="0"
            width="100%"
            height="100%"
            className="w-full h-full border-none"
            onLoad={() => setIsLoaded(true)}
            title="Interactive 3D Scene"
            loading="lazy"
            allow="autoplay"
          />
        ) : (
          <Spline scene={scene} onLoad={handleLoad} />
        )}
      </div>
    </div>
  );
}
