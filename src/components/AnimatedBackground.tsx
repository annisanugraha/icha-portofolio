'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Particle system — fewer particles, less GPU load
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = isMobile ? 15 : 35; // reduced from 20/60
    const colors = ['#111', '#999', '#e8e8e8'];

    const particles: { x: number; y: number; size: number; opacity: number; color: string }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, // smaller particles
        opacity: Math.random() * 0.4 + 0.1, // more subtle
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Track pause state
    let isPaused = false;

    // Animate particles — slower duration = less frequent repaints
    const animation = animate(particles, {
      x: (el: any) => el.x + (Math.random() - 0.5) * 80,
      y: (el: any) => el.y + (Math.random() - 0.5) * 80,
      opacity: (el: any) => el.opacity + (Math.random() - 0.5) * 0.2,
      duration: 6000, // slower = less CPU per frame
      easing: 'inOutQuad',
      loop: true,
      direction: 'alternate',
      update: () => {
        if (isPaused) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, Math.min(0.6, p.opacity));
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      },
    });

    // Pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse interaction - only on non-touch devices, throttled
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouch) {
      let lastMouseTime = 0;
      const MOUSE_THROTTLE = 50; // ~20fps max — less frequent than before
      const handleMouseThrottled = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastMouseTime < MOUSE_THROTTLE) return;
        lastMouseTime = now;
        particles.forEach((p) => {
          const dx = e.clientX - p.x;
          const dy = e.clientY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x -= dx * 0.015;
            p.y -= dy * 0.015;
          }
        });
      };
      window.addEventListener('mousemove', handleMouseThrottled, { passive: true });

      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseThrottled);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} id="animated-bg" />;
}