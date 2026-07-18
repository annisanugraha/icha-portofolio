'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, animate } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

/**
 * ScrollChapterIndicator — HoYoverse-inspired scroll progress indicator
 * Shows chapter dots on the right side of the viewport.
 * Active chapter is highlighted, and a brief chapter name flashes on transition.
 */

const CHAPTERS = [
  { id: 'hero', label: 'NICE TO MEET YOU', number: '01' },
  { id: 'about', label: 'BEHIND THE SCREEN', number: '02' },
  { id: 'work', label: 'THE CRAFT', number: '03' },
  { id: 'play', label: "LET'S HAVE FUN", number: '04' },
  { id: 'archives', label: 'THE EVIDENCE', number: '05' },
  { id: 'contact', label: "LET'S TALK", number: '06' },
];

export function ScrollChapterIndicator() {
  const [activeChapter, setActiveChapter] = useState('hero');
  const [showLabel, setShowLabel] = useState(false);
  const [prevChapter, setPrevChapter] = useState('hero');
  const activeChapterRef = useRef(activeChapter);
  activeChapterRef.current = activeChapter;

  const pathname = usePathname();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight * 0.45; // slightly above middle for responsive trigger
      let closestId = activeChapterRef.current;
      let minDistance = Infinity;

      CHAPTERS.forEach((c) => {
        const el = document.getElementById(c.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if section currently spans over the viewport center
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            closestId = c.id;
            minDistance = 0;
          } else {
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(center - viewportCenter);
            if (dist < minDistance && rect.top < window.innerHeight && rect.bottom > 0) {
              minDistance = dist;
              closestId = c.id;
            }
          }
        }
      });

      if (closestId && closestId !== activeChapterRef.current) {
        setPrevChapter(activeChapterRef.current);
        setActiveChapter(closestId);
      }
    };

    // Run check on scroll, resize, and periodically for dynamic layouts
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    const interval = setInterval(handleScroll, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Flash chapter label on change
  useEffect(() => {
    if (activeChapter !== prevChapter) {
      setShowLabel(true);
      const timer = setTimeout(() => setShowLabel(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [activeChapter, prevChapter]);

  const scrollTo = (id: string) => {
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      document.documentElement.style.scrollBehavior = 'auto';
      animate(window.scrollY, top, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => window.scrollTo(0, latest),
        onComplete: () => { document.documentElement.style.scrollBehavior = ''; }
      });
    }
  };

  const currentChapter = CHAPTERS.find((c) => c.id === activeChapter);

  return (
    <div className="chapter-indicator">
      {/* Progress line */}
      <div className="chapter-progress-line">
        <motion.div
          style={{ height: progressHeight }}
          className="absolute top-0 left-0 w-full bg-[#111]"
        />
      </div>

      {/* Chapter dots */}
      {CHAPTERS.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => scrollTo(chapter.id)}
          className={`chapter-dot ${activeChapter === chapter.id ? 'active' : ''}`}
          title={`CH.${chapter.number} — ${chapter.label}`}
          aria-label={`Navigate to ${chapter.label}`}
        />
      ))}

      {/* Chapter label flash */}
      <AnimatePresence>
        {showLabel && currentChapter && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-10 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <span className="font-mono text-[8px] tracking-[0.5em] text-[#999] uppercase">
              CH.{currentChapter.number}
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-[#bbb] uppercase ml-3">
              {currentChapter.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
