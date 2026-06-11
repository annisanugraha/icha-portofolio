'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate as motionAnimate } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

// CINEMATIC TAPE INTRO TIMELINE:
// Stage 0 (0–2.5s):   Diagonal tapes sweep in from left/right, stamping text
// Stage 1 (2.5–4.2s): Tapes hold — name punches through the gap
// Stage 2 (4.2–5.5s): Everything tears apart — tapes fly off screen
// Stage 3 (5.5–6.1s): Flash to white → complete

const TAPE_TEXTS = [
  'ANNISA NUGRAHA — PORTFOLIO — ANNISA NUGRAHA — PORTFOLIO — ',
  'UI/UX DESIGNER — ENGINEER — UI/UX DESIGNER — ENGINEER — ',
  'ANNISA NUGRAHA — PORTFOLIO — ANNISA NUGRAHA — PORTFOLIO — ',
  'UI/UX DESIGNER — ENGINEER — UI/UX DESIGNER — ENGINEER — ',
  'ANNISA NUGRAHA — PORTFOLIO — ANNISA NUGRAHA — PORTFOLIO — ',
];

// Each tape: rotation, y-position (%), direction of scroll, delay
const TAPE_CONFIG = [
  { rotate: -8,  yPct: 20, dir: 1,  delay: 0,    width: '160%' },
  { rotate: -4,  yPct: 33, dir: -1, delay: 0.15, width: '160%' },
  { rotate: -8,  yPct: 46, dir: 1,  delay: 0.05, width: '160%' },
  { rotate: -4,  yPct: 59, dir: -1, delay: 0.2,  width: '160%' },
  { rotate: -8,  yPct: 72, dir: 1,  delay: 0.1,  width: '160%' },
];

interface ScrollingTapeProps {
  text: string;
  rotate: number;
  yPct: number;
  dir: number;
  delay: number;
  width: string;
  isExiting: boolean;
}

function ScrollingTape({ text, rotate, yPct, dir, delay, width, isExiting }: ScrollingTapeProps) {
  const repeated = text.repeat(6);

  return (
    <motion.div
      initial={{ x: dir > 0 ? '-110%' : '110%', opacity: 0 }}
      animate={
        isExiting
          ? { x: dir > 0 ? '110%' : '-110%', opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 1, 1] } }
          : { x: '0%', opacity: 1, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } }
      }
      style={{
        position: 'absolute',
        top: `${yPct}%`,
        left: '50%',
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width,
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Tape body */}
      <div
        style={{
          background: '#ffffff',
          borderTop: '2px solid #000',
          borderBottom: '2px solid #000',
          padding: '10px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal stripe pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent 0px,
              transparent 12px,
              rgba(0,0,0,0.07) 12px,
              rgba(0,0,0,0.07) 14px
            )`,
            pointerEvents: 'none',
          }}
        />

        {/* Scrolling text */}
        <motion.div
          animate={{ x: dir > 0 ? [0, -800] : [-800, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
        >
          <span
            style={{
              fontFamily: '"Arial Black", "Impact", sans-serif',
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '0.15em',
              color: '#000',
              textTransform: 'uppercase',
            }}
          >
            {repeated}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [isVisible, setIsVisible] = useState(true);
  const [flashWhite, setFlashWhite] = useState(false);
  const progressValue = useMotionValue(0);
  const progressScaleX = useTransform(progressValue, [0, 100], [0, 1]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenIntro = sessionStorage.getItem('icha-intro-seen');
      if (hasSeenIntro) {
        onComplete();
        return;
      }
    }

    // Animate progress counter 0→100
    const controls = motionAnimate(progressValue, 100, { duration: 2.2, ease: 'easeInOut' });

    const t1 = setTimeout(() => setStage(1), 2500);   // name reveal through tape gap
    const t2 = setTimeout(() => setStage(2), 4200);   // tapes tear away
    const t3 = setTimeout(() => {
      setFlashWhite(true);                             // flash to white
    }, 5200);
    const t4 = setTimeout(() => {
      sessionStorage.setItem('icha-intro-seen', 'true');
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 5800);

    return () => {
      controls.stop?.();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, progressValue]);

  const handleSkip = () => {
    sessionStorage.setItem('icha-intro-seen', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 200);
  };

  const isExiting = stage >= 2;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleSkip}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0a0a0a',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* === BACKGROUND GRID === */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* === CORNER CROSSHAIRS === */}
          {[
            { top: 24, left: 24 },
            { top: 24, right: 24 },
            { bottom: 24, left: 24 },
            { bottom: 24, right: 24 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{ position: 'absolute', width: 32, height: 32, ...pos }}
            >
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#fff', transform: 'translateY(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#fff', transform: 'translateX(-50%)' }} />
            </motion.div>
          ))}

          {/* === SCROLLING TAPES === */}
          {TAPE_CONFIG.map((cfg, i) => (
            <ScrollingTape
              key={i}
              text={TAPE_TEXTS[i]}
              rotate={cfg.rotate}
              yPct={cfg.yPct}
              dir={cfg.dir}
              delay={cfg.delay}
              width={cfg.width}
              isExiting={isExiting}
            />
          ))}

          {/* === CENTER CONTENT === */}
          <div
            style={{
              position: 'relative',
              zIndex: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0px',
            }}
          >
            {/* Vertical bar / countdown */}
            <AnimatePresence>
              {stage === 0 && (
                <motion.div
                  key="counter"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.25 } }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {/* Big progress number */}
                  <motion.span
                    style={{
                      fontFamily: '"Arial Black", Impact, sans-serif',
                      fontWeight: 900,
                      fontSize: 'clamp(80px, 18vw, 160px)',
                      color: '#fff',
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    <MotionNumber value={progressValue} />
                  </motion.span>

                  {/* Progress bar */}
                  <div
                    style={{
                      width: 200,
                      height: 3,
                      background: '#222',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#fff',
                        transformOrigin: 'left',
                        scaleX: progressScaleX,
                      }}
                    />
                  </div>

                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      letterSpacing: '0.4em',
                      color: '#555',
                      textTransform: 'uppercase',
                    }}
                  >
                    Loading Portfolio
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* === NAME PUNCH-THROUGH (stage 1+) === */}
            <AnimatePresence>
              {stage >= 1 && stage < 2 && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, scale: 1.3, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    mixBlendMode: 'difference',
                    filter: 'invert(1)',
                  }}
                >
                  {/* Thin line above */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ width: 80, height: 2, background: '#fff' }}
                  />

                  <div style={{ position: 'relative' }}>
                    {/* Stamp rectangle behind name */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.35, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        position: 'absolute',
                        inset: '-6px -12px',
                        background: '#000',
                        transformOrigin: 'left',
                        zIndex: -1,
                      }}
                    />
                    <h1
                      style={{
                        fontFamily: '"Arial Black", Impact, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(28px, 7vw, 72px)',
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        textTransform: 'uppercase',
                        position: 'relative',
                        zIndex: 1,
                        padding: '0 4px',
                      }}
                    >
                      Annisa Nugraha
                    </h1>
                  </div>

                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      letterSpacing: '0.45em',
                      color: '#fff',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    Software Engineer · UI/UX
                  </span>

                  {/* Thin line below */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    style={{ width: 80, height: 2, background: '#fff' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* === FLASH TO WHITE === */}
          <AnimatePresence>
            {flashWhite && (
              <motion.div
                key="flash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeIn' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#fff',
                  zIndex: 100,
                }}
              />
            )}
          </AnimatePresence>

          {/* === SKIP HINT === */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 1.5 }}
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.5em',
              color: '#fff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              zIndex: 30,
            }}
          >
            Click anywhere to skip
          </motion.p>

          {/* === TOP-LEFT LABEL === */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.35, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'absolute',
              top: 28,
              left: 28,
              fontFamily: 'monospace',
              fontSize: 9,
              color: '#fff',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              lineHeight: 1.6,
              zIndex: 30,
            }}
          >
            <div>Portfolio · 2025</div>
            <div style={{ opacity: 0.5 }}>Loading...</div>
          </motion.div>

          {/* === TOP-RIGHT STAGE DOTS === */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              right: 28,
              display: 'flex',
              gap: 8,
              zIndex: 30,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  background: stage > i ? '#fff' : stage === i ? '#fff' : '#333',
                  opacity: stage > i ? 1 : stage === i ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
                style={{ width: 6, height: 6, borderRadius: '50%' }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper: animated number that reads from a MotionValue
function MotionNumber({ value }: { value: ReturnType<typeof useMotionValue> }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = value.on('change', (v) => {
      setDisplay(Math.floor(v));
    });
    return unsubscribe;
  }, [value]);

  return <>{display}%</>;
}