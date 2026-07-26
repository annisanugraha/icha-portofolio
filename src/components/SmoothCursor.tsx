'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * SmoothCursor — Premium custom cursor with trailing dot and chat bubble support.
 * Uses spring physics for smooth follow, enlarges on interactive elements.
 * Uses mix-blend-mode: difference for the dot, switches to normal for the bubble.
 */
export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const hasMovedRef = useRef(false);

  // Snappy, crisp springs that follow instantly without long oscillation locks
  const springConfig = { damping: 35, stiffness: 500, mass: 0.3 };
  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      }

      if (!isVisible) setIsVisible(true);
    };

    const updateCursorStateFromTarget = (target: Element | null) => {
      if (!target) return;
      // Check for data-cursor text
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor') || '');
        setIsHovering(false); // If it's a text bubble, don't show the hover dot
      } else {
        setCursorText('');
        // Check for interactive elements
        if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('[role="button"]') ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer')
        ) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      }
    };

    const handleMouseOver = (e: Event) => {
      setIsVisible(true);
      updateCursorStateFromTarget(e.target as Element);
    };

    let scrollRafId: number | null = null;
    const handleScroll = () => {
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        const cx = cursorX.get();
        const cy = cursorY.get();
        if (cx < 0 || cy < 0) return;
        const el = document.elementFromPoint(cx, cy);
        updateCursorStateFromTarget(el);
      });
    };

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement;
      // When leaving the document entirely
      if (target.nodeName === 'HTML') {
        setIsVisible(false);
        setCursorText('');
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, [cursorX, cursorY, dotX, dotY, isVisible]);

  if (isTouch) return null;

  const hasText = Boolean(cursorText);
  // Calculate dynamic width based on text length to make it snappy
  const pillWidth = cursorText.length > 22 ? 220 : cursorText.length > 14 ? 170 : cursorText.length > 6 ? 130 : 90;
  const TAIL_HEIGHT = 8;

  // Offsets so the cursor point sits nicely at the top-left of the bubble
  const targetTranslateX = hasText ? 4 : isHovering ? -21 : -6;
  const targetTranslateY = hasText ? -(32 + TAIL_HEIGHT) : isHovering ? -21 : -6;

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        className="!pointer-events-none !select-none"
        style={{
          x: dotX,
          y: dotY,
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999999,
          mixBlendMode: hasText ? 'normal' : 'difference',
        }}
      >
        <motion.div
          className="!pointer-events-none !select-none"
          animate={{
            opacity: isVisible ? 1 : 0,
            x: targetTranslateX,
            y: targetTranslateY,
          }}
          transition={{
            opacity: { duration: 0.15 },
            x: { type: 'spring', damping: 35, stiffness: 500, mass: 0.3 },
            y: { type: 'spring', damping: 35, stiffness: 500, mass: 0.3 },
          }}
        >
          <motion.div
            className="!pointer-events-none !select-none"
            style={{
              backgroundColor: hasText ? '#111' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              position: 'relative',
            }}
            animate={{
              width: hasText ? pillWidth : isHovering ? 42 : 12,
              height: hasText ? 32 : isHovering ? 42 : 12,
              borderRadius: hasText ? '16px 16px 16px 0px' : '24px 24px 24px 24px',
            }}
            transition={{
              width: { type: 'spring', damping: 32, stiffness: 450, mass: 0.3 },
              height: { type: 'spring', damping: 32, stiffness: 450, mass: 0.3 },
              borderRadius: { type: 'spring', damping: 32, stiffness: 450, mass: 0.3 },
            }}
          >
            <AnimatePresence mode="wait">
              {hasText && (
                <motion.span
                  key={cursorText}
                  className="!pointer-events-none !select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12, delay: 0.05 }}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '0.03em',
                    lineHeight: 1,
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    paddingLeft: 14,
                    paddingRight: 14,
                  }}
                >
                  {cursorText}
                </motion.span>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hasText && (
                <motion.svg
                  key="tail"
                  viewBox="0 0 10 8"
                  width={10}
                  height={8}
                  className="!pointer-events-none !select-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    bottom: -7,
                    left: 0,
                    fill: '#111',
                    display: 'block',
                  }}
                >
                  <path d="M0 0 L10 0 L0 8 Z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
