'use client';

import { useState, useEffect } from 'react';
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

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

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
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    const handleMouseOver = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseEnter, true);
    document.addEventListener('mouseout', handleMouseLeave, true);
    document.documentElement.addEventListener('mouseleave', handleMouseOut);
    document.documentElement.addEventListener('mouseenter', handleMouseOver);

    return () => {
      document.documentElement.classList.remove('smooth-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseEnter, true);
      document.removeEventListener('mouseout', handleMouseLeave, true);
      document.documentElement.removeEventListener('mouseleave', handleMouseOut);
      document.documentElement.removeEventListener('mouseenter', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

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
