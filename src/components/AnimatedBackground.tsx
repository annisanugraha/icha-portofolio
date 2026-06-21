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
    window.addEventListener('resize', resize);

    // Particle system
    const particles: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
    }[] = [];

    // Responsive particle count — fewer on mobile for better perf
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = isMobile ? 20 : 60;
    const colors = ['#111', '#999', '#e8e8e8'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Animate particles with anime.js v4
    animate(particles, {
      x: (el: any) => el.x + (Math.random() - 0.5) * 100,
      y: (el: any) => el.y + (Math.random() - 0.5) * 100,
      opacity: (el: any) => el.opacity + (Math.random() - 0.5) * 0.3,
      duration: 4000,
      easing: 'inOutQuad',
      loop: true,
      direction: 'alternate',
      update: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(0.8, p.opacity));
          ctx.fill();
        });

        ctx.globalAlpha = 1;
      },
    });

    // Mouse interaction - only on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const handleMouse = (e: MouseEvent) => {
      particles.forEach((p) => {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }
      });
    };

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouse);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouse);
      }
    };
  }, []);

  return <canvas ref={canvasRef} id="animated-bg" />;
}