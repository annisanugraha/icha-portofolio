'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Application } from '@splinetool/runtime';

// ── Load Spline with no SSR (avoids async Client Component error in Next.js 15)
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null, // Silent — no UI spinner while loading
});

// ── Loading Indicator ────────────────────────────────────────────────────────
// (intentionally removed from UI — Spline loads silently in the background)
// If Spline fails, it simply doesn't appear. Error is logged to console only.

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
  defaultCursorText?: string;
  clickedCursorText?: string;
}

export function SplineScene({
  scene,
  className = '',
  defaultCursorText = 'Click me!',
  clickedCursorText = 'That tickles~♪',
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // only mount when in view
  const [cursorLabel, setCursorLabel] = useState(defaultCursorText);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
  }, []);

  // Only mount Spline when the container is visible in the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCursorLabel(defaultCursorText);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('mousemove'));
      }
    }, 1300);
  }, [defaultCursorText]);

  const handlePointerDown = useCallback(() => {
    if (!clickedCursorText) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isHoldingRef.current = true;
    setCursorLabel(clickedCursorText);
  }, [clickedCursorText]);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isHoldingRef.current = false;
    setCursorLabel(defaultCursorText);
  }, [defaultCursorText]);

  useEffect(() => {
    const onGlobalUp = () => {
      if (isHoldingRef.current) {
        handlePointerUp();
      }
    };
    window.addEventListener('pointerup', onGlobalUp, { capture: true });
    window.addEventListener('mouseup', onGlobalUp, { capture: true });
    return () => {
      window.removeEventListener('pointerup', onGlobalUp, { capture: true });
      window.removeEventListener('mouseup', onGlobalUp, { capture: true });
    };
  }, [handlePointerUp]);

  const handleLoad = useCallback((splineApp: Application) => {
    setIsLoaded(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const app = splineApp as any;
      if (app._scene) {
        app._scene.background = null;
        if (app._scene.traverse) {
          app._scene.traverse((obj: any) => {
            const name = (obj.name || '').toLowerCase();
            if (name.includes('background') || name.includes('rectangle') || name.includes('plane') || name.includes('backdrop') || name === 'bg') {
              obj.visible = false;
            }
          });
        }
      }
      if (app.setBackgroundColor) {
        try {
          app.setBackgroundColor('transparent');
        } catch {}
      }
      if (app.canvas) {
        app.canvas.style.backgroundColor = 'transparent';
        app.canvas.style.background = 'transparent';
      }
      const renderer = app._renderer;
      if (renderer) {
        if (renderer.domElement) {
          renderer.domElement.style.backgroundColor = 'transparent';
          renderer.domElement.style.background = 'transparent';
        }
        if (renderer.setClearColor) {
          renderer.setClearColor(0x000000, 0);
          renderer.setClearAlpha(0);
        }
      }
      // Scale camera zoom balanced (1.16x) so it fits perfectly without clipping
      const camera = app._camera;
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
    <div
      ref={containerRef}
      data-cursor={cursorLabel}
      onPointerDownCapture={handlePointerDown}
      onMouseDownCapture={handlePointerDown}
      onPointerUpCapture={handlePointerUp}
      onMouseUpCapture={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent ${className}`}
    >
      {/* No loading UI — Spline fades in silently when ready */}
      <div className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {isVisible && (isIframeUrl ? (
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
          <Spline scene={scene} onLoad={handleLoad} onSplineMouseDown={handlePointerDown} onSplineMouseUp={handlePointerUp} />
        ))}
      </div>
    </div>
  );
}
