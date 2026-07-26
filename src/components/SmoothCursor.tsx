'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * SmoothCursor — White dot with mix-blend-mode: difference.
 * Morphs into a clean chat bubble when hovering [data-cursor] elements.
 */
export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);
  const hasMovedRef = useRef(false);
  const cursorTextRef = useRef('');
  const mouseXRef = useRef(-100);
  const mouseYRef = useRef(-100);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Snappy, crisp springs that follow instantly without long oscillation locks
  const springConfig = { damping: 35, stiffness: 500, mass: 0.3 };
  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    document.documentElement.classList.add('smooth-cursor-active');

    const updateCursorState = (x: number, y: number, targetEl?: Element | null) => {
      if (x < 0 || y < 0) return;
      let el = targetEl !== undefined ? targetEl : document.elementFromPoint(x, y);

      // If the mouse hit our own custom cursor (self-collision), check element underneath or ignore
      if (el?.closest('.smooth-cursor-root')) {
        return;
      }

      if (!el || !(el instanceof Element)) {
        if (cursorTextRef.current !== '') {
          cursorTextRef.current = '';
          setCursorText('');
        }
        return;
      }

      setIsVisible(true);

      // Check data-cursor
      const cursorEl = el.closest('[data-cursor]');
      const label = cursorEl?.getAttribute('data-cursor') || '';
      if (label !== cursorTextRef.current) {
        cursorTextRef.current = label;
        setCursorText(label);
      }

      // Check interactive (only when not showing text bubble)
      if (label) {
        setIsHovering(false);
      } else {
        const isInteractive =
          el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.closest('a') !== null ||
          el.closest('button') !== null ||
          el.closest('[role="button"]') !== null ||
          el.classList.contains('cursor-pointer') ||
          el.closest('.cursor-pointer') !== null;
        setIsHovering(isInteractive);
      }
    };

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      }

      updateCursorState(e.clientX, e.clientY, e.target instanceof Element ? e.target : null);
    };

    let scrollRafId: number | null = null;
    const handleScroll = () => {
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        updateCursorState(mouseXRef.current, mouseYRef.current);
      });
    };

    const handleReset = () => {
      cursorTextRef.current = '';
      setCursorText('');
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleReset);
    window.addEventListener('blur', handleReset);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleReset();
    });

    return () => {
      document.documentElement.classList.remove('smooth-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('pointerleave', handleReset);
      window.removeEventListener('blur', handleReset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isTouch) return null;

  const hasText = Boolean(cursorText);
  const pillWidth = cursorText.length > 22 ? 220 : cursorText.length > 14 ? 170 : cursorText.length > 6 ? 130 : 90;
  const TAIL_HEIGHT = 8;

  const targetTranslateX = hasText ? 4 : isHovering ? -21 : -6;
  const targetTranslateY = hasText ? -(32 + TAIL_HEIGHT) : isHovering ? -21 : -6;

  return (
    <motion.div
      className="smooth-cursor-root !pointer-events-none !select-none"
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
  );
}
