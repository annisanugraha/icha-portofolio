'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'animejs';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    if (typeof window !== 'undefined') {
      const hasSeenIntro = sessionStorage.getItem('icha-intro-seen');
      if (hasSeenIntro) {
        onComplete();
        return;
      }
    }

    // Character-by-character animation
    const titleText = "Building things that matter.";
    const chars = titleText.split('');

    // Create character spans
    const container = document.getElementById('intro-title');
    if (container) {
      container.innerHTML = chars
        .map((char, i) => `<span class="char" style="display:inline-block; opacity:0; transform: translateY(20px)">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');

      // Animate characters with stagger using delay array
      const delays = chars.map((_, i) => 300 + i * 40);
      animate('.char', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 80,
        delay: delays,
        easing: 'outQuad',
        complete: () => {
          setSubtitleVisible(true);
        },
      });
    }

    // Particle effect
    const particleContainer = document.getElementById('intro-particles');
    if (particleContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'intro-particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: #111;
          border-radius: 50%;
          opacity: ${Math.random() * 0.3 + 0.1};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        particleContainer.appendChild(particle);
      }

      animate('.intro-particle', {
        translateY: () => (Math.random() - 0.5) * 100,
        translateX: () => (Math.random() - 0.5) * 100,
        opacity: () => Math.random() * 0.3 + 0.1,
        duration: () => Math.random() * 2000 + 2000,
        easing: 'inOutQuad',
        loop: true,
        direction: 'alternate',
      });
    }

    // Prefetch /work in the background while intro is playing
    const prefetchWork = document.createElement('link');
    prefetchWork.rel = 'prefetch';
    prefetchWork.href = '/work';
    document.head.appendChild(prefetchWork);

    // Auto dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      sessionStorage.setItem('icha-intro-seen', 'true');
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('icha-intro-seen', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center cursor-pointer"
          onClick={handleSkip}
        >
          {/* Particles */}
          <div id="intro-particles" className="absolute inset-0 overflow-hidden" />

          {/* Content */}
          <div className="text-center space-y-6 relative z-10">
            {/* Main title */}
            <div className="overflow-hidden">
              <h1
                id="intro-title"
                className="text-4xl md:text-6xl font-serif text-black leading-[1.0]"
                style={{ minHeight: '1.5em' }}
              />
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: subtitleVisible ? 1 : 0, y: subtitleVisible ? 0 : 10 }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-8 h-px bg-[#111]" />
                <p className="text-xs text-[#999] tracking-wide font-mono">
                  Engineering & minimal design.
                </p>
                <div className="w-8 h-px bg-[#111]" />
              </div>
            </motion.div>

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-[10px] text-[#bbb] font-mono tracking-widest mt-8"
            >
              CLICK ANYWHERE TO SKIP
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}