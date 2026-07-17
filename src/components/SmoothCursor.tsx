'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * SmoothCursor — Premium custom cursor with trailing dot
 * Uses spring physics for smooth follow, enlarges on interactive elements,
 * and uses mix-blend-mode: difference for visibility on any background.
 * Hidden on mobile/touch devices.
 */
export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const hasMovedRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring for smooth trailing
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    // Hide native cursor globally when smooth cursor is active
    document.documentElement.classList.add('smooth-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }

      // If hovering over an iframe (like cross-origin Spline 3D scene),
      // the native cursor inside the iframe takes over, so hide smooth cursor
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IFRAME' || target.closest('iframe'))) {
        setIsVisible(false);
      } else if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.tagName === 'IFRAME' || target.closest('iframe')) {
        setIsVisible(false);
        setIsHovering(false);
        return;
      }

      // Check if target or any parent is interactive
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer') !== null;

      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      if (hasMovedRef.current) {
        setIsVisible(true);
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.documentElement.classList.remove('smooth-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('pointerover', handlePointerOver);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <>
      {/* Trailing dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          position: 'fixed',
          top: -6,
          left: -6,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{
          scale: isHovering ? 3.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { type: 'spring', damping: 20, stiffness: 300 },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}
