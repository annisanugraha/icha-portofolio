'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * SmoothCursor — Premium custom cursor with trailing dot and chat bubble support.
 * Uses spring physics for smooth follow, enlarges on interactive elements.
 * Event listeners are registered ONCE (empty dep array) — state is accessed via refs.
 */
export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  // Keep latest state in refs so event callbacks never capture stale closures
  const isVisibleRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const hasInitRef = useRef(false);

  const springConfig = { damping: 35, stiffness: 500, mass: 0.3 };
  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  const isInteractive = useCallback((target: Element | null): boolean => {
    if (!target) return false;
    const el = target as HTMLElement;
    return (
      el.tagName === 'A' ||
      el.tagName === 'BUTTON' ||
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'SELECT' ||
      !!el.closest('a') ||
      !!el.closest('button') ||
      !!el.closest('[role="button"]') ||
      el.classList.contains('cursor-pointer') ||
      !!el.closest('.cursor-pointer')
    );
  }, []);

  const updateFromElement = useCallback((target: Element | null) => {
    if (!target) return;
    const cursorTarget = target.closest('[data-cursor]');
    if (cursorTarget) {
      setCursorText(cursorTarget.getAttribute('data-cursor') || '');
      setIsHovering(false);
    } else {
      setCursorText('');
      setIsHovering(isInteractive(target));
    }
  }, [isInteractive]);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!hasInitRef.current) {
        hasInitRef.current = true;
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      }
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onMouseOver = (e: Event) => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      updateFromElement(e.target as Element);
    };

    const onMouseOut = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.nodeName === 'HTML') {
        isVisibleRef.current = false;
        setIsVisible(false);
        setCursorText('');
        setIsHovering(false);
      }
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const cx = cursorX.get();
        const cy = cursorY.get();
        if (cx < 0 || cy < 0) return;
        updateFromElement(document.elementFromPoint(cx, cy));
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mouseout', onMouseOut, true);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('mouseout', onMouseOut, true);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — listeners registered once, refs prevent stale closure

  if (isTouch) return null;

  const hasText = Boolean(cursorText);
  const pillWidth = cursorText.length > 22 ? 220 : cursorText.length > 14 ? 170 : cursorText.length > 6 ? 130 : 90;
  const TAIL_HEIGHT = 8;

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
          willChange: 'transform',
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
