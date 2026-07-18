'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * SmoothCursor — White dot with mix-blend-mode: difference.
 * Morphs into a WhatsApp-style chat bubble when hovering [data-cursor] elements.
 */
export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouch, setIsTouch] = useState(false);
  const hasMovedRef = useRef(false);
  const cursorTextRef = useRef('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    document.documentElement.classList.add('smooth-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      if (target && (target.tagName === 'IFRAME' || target.closest('iframe'))) {
        setIsVisible(false);
        return;
      }

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      }

      const cursorEl = target?.closest('[data-cursor]');
      if (cursorEl) {
        const label = cursorEl.getAttribute('data-cursor') || '';
        if (label !== cursorTextRef.current) {
          cursorTextRef.current = label;
          setCursorText(label);
        }
      }

      setIsVisible(true);
    };

    const handleGlobalClick = () => {
      setTimeout(() => {
        const elUnderMouse = document.elementFromPoint(cursorX.get(), cursorY.get());
        const cursorEl = elUnderMouse?.closest('[data-cursor]');
        if (cursorEl) {
          const label = cursorEl.getAttribute('data-cursor') || '';
          if (label !== cursorTextRef.current) {
            cursorTextRef.current = label;
            setCursorText(label);
          }
        }
      }, 30);
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.tagName === 'IFRAME' || target.closest('iframe')) {
        setIsVisible(false);
        setIsHovering(false);
        setCursorText('');
        cursorTextRef.current = '';
        return;
      }

      // data-cursor
      const cursorEl = target.closest('[data-cursor]');
      if (cursorEl) {
        const label = cursorEl.getAttribute('data-cursor') || '';
        if (label !== cursorTextRef.current) {
          cursorTextRef.current = label;
          setCursorText(label);
        }
        setIsHovering(false);
        return;
      }

      if (cursorTextRef.current) {
        cursorTextRef.current = '';
        setCursorText('');
      }

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

      setIsHovering(isInteractive);
    };

    const handlePointerLeave = () => {
      cursorTextRef.current = '';
      setCursorText('');
      setIsVisible(false);
      setIsHovering(false);
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-cursor') {
          const mutatedEl = mutation.target as HTMLElement;
          const elUnderMouse = document.elementFromPoint(cursorX.get(), cursorY.get());
          const cursorEl = elUnderMouse?.closest('[data-cursor]') || (mutatedEl && mutatedEl.contains(elUnderMouse as Node) ? mutatedEl : null);
          if (cursorEl) {
            const currentLabel = cursorEl.getAttribute('data-cursor') || '';
            if (currentLabel !== cursorTextRef.current) {
              cursorTextRef.current = currentLabel;
              setCursorText(currentLabel);
            }
          }
        }
      }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-cursor'] });

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('pointerdown', handleGlobalClick, { capture: true, passive: true });
    document.addEventListener('mousedown', handleGlobalClick, { capture: true, passive: true });
    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.documentElement.classList.remove('smooth-cursor-active');
      observer.disconnect();
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('pointerdown', handleGlobalClick, { capture: true });
      document.removeEventListener('mousedown', handleGlobalClick, { capture: true });
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      document.removeEventListener('pointerover', handlePointerOver);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isTouch) return null;

  const hasText = Boolean(cursorText);
  // Fixed pixel width based on text length — avoids 'auto' which breaks Framer Motion
  const pillWidth = cursorText.length > 22 ? 220 : cursorText.length > 14 ? 170 : cursorText.length > 6 ? 130 : 90;
  const TAIL_HEIGHT = 8;

  return (
    <motion.div
      style={{
        x: dotX,
        y: dotY,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999999,
        mixBlendMode: hasText ? 'normal' : 'difference', // Remove difference blending when bubble is active
        translateX: hasText ? 2 : -6,
        translateY: hasText ? -(32 + TAIL_HEIGHT) : -6,
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.15 } }}
    >
      {/* Bubble element */}
      <motion.div
        style={{
          backgroundColor: hasText ? '#111' : '#fff', // Solid black when it has text
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',           // allow tail to stick out below
          position: 'relative',
        }}
        animate={{
          width: hasText ? pillWidth : isHovering ? 42 : 12,
          height: hasText ? 32 : isHovering ? 42 : 12,
          borderRadius: hasText ? '16px 16px 16px 0px' : '24px 24px 24px 24px',
        }}
        transition={{
          width: { type: 'spring', damping: 26, stiffness: 300 },
          height: { type: 'spring', damping: 26, stiffness: 300 },
          borderRadius: { type: 'spring', damping: 26, stiffness: 300 },
        }}
      >
        {/* Text — color #000 so inside the white pill it inverts to white text on black pill */}
        <AnimatePresence mode="wait">
          {hasText && (
            <motion.span
              key={cursorText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, delay: 0.1 }}
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

        {/* Bubble tail — SVG overlapping 1px into the flat bottom-left corner so zero gap/seam */}
        <AnimatePresence>
          {hasText && (
            <motion.svg
              key="tail"
              viewBox="0 0 10 8"
              width={10}
              height={8}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                bottom: -7, // overlaps 1px with bottom of pill to eliminate any subpixel line
                left: 0,
                fill: '#111', // Black tail
                display: 'block',
              }}
            >
              <path d="M0 0 L10 0 L0 8 Z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
