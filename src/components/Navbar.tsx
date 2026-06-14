'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, animate } from 'framer-motion';

const navItems = [
  { id: 'hero', label: 'Home', chapter: '01' },
  { id: 'about', label: 'About', chapter: '02' },
  { id: 'work', label: 'Work', chapter: '03' },
  { id: 'play', label: '✤', chapter: '04' },
  { id: 'archives', label: 'Archives', chapter: '05' },
];

export const Navbar = ({ logoText, logoImage }: { logoText?: string | null; logoImage?: string | null }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  
  // Desktop sidebar border opacity based on scroll
  const borderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'work', 'play', 'archives'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px', // Middle 20% of screen is the trigger zone
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Initial active section
    const initialSection = sections.find(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
      }
      return false;
    });
    if (initialSection) setActiveSection(initialSection);

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const hash = `#${id}`;
    const currentHash = window.location.hash;

    if (currentHash !== hash) {
      window.history.pushState(null, '', hash);
    }

    const el = document.getElementById(id);
    if (el) {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 48 : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      
      // Temporarily disable CSS scroll-behavior to prevent conflict with JS animation
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Use framer-motion's animate for reliable long-distance scrolling
      // (Bypasses native chromium smooth scroll bugs on long pages)
      animate(window.scrollY, top, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => window.scrollTo(0, latest),
        onComplete: () => {
          document.documentElement.style.scrollBehavior = '';
        }
      });
    }
  };

  const logoContent = (
<div className="flex flex-col items-center gap-2">
      {logoImage && (
        <img
          src={logoImage}
          alt={logoText || "Logo"}
          className="w-8 h-8 object-contain transition-opacity duration-500 hover:opacity-80"
        />
      )}
      {logoText && (
        <span className="font-mono font-medium text-[9px] tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180 text-center leading-none">
          {logoText}
        </span>
      )}
    </div>
  );

  const mobileLogoContent = (
    <div className="flex items-center gap-3">
      {logoImage && (
        <img
          src={logoImage}
          alt={logoText || "Logo"}
          className="w-6 h-6 object-contain"
        />
      )}
      {logoText && (
        <span className="font-mono font-medium text-[9px] tracking-[0.2em] uppercase whitespace-nowrap">
          {logoText}
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar Nav ── */}
      <motion.nav 
        className="fixed left-0 top-0 bottom-0 w-16 hidden md:flex flex-col items-center justify-between py-10 bg-white/95 backdrop-blur-sm border-r border-[#ebebeb] z-50"
        style={{ borderRightColor: useTransform(borderOpacity, v => `rgba(235,235,235,${v})`) }}
      >

        {/* Logo - scroll to top */}
        <button onClick={() => scrollTo('hero')} className="transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          {logoContent}
        </button>

        {/* Nav Links - scroll to sections */}
        <div className="flex flex-col items-center gap-5">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer relative"
              >
                {/* Active indicator — animated line */}
                <motion.div 
                  className="w-px bg-[#111]"
                  animate={{ height: active ? 12 : 0, opacity: active ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Chapter number — appears on active */}
                <motion.span
                  animate={{ opacity: active ? 0.4 : 0, height: active ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[7px] font-mono tracking-[0.3em] text-[#999] overflow-hidden"
                >
                  {item.chapter}
                </motion.span>

                {/* Label with letter-spacing hover */}
                <motion.span
                  animate={{
                    letterSpacing: active ? '0.4em' : '0.3em',
                  }}
                  whileHover={{
                    letterSpacing: '0.45em',
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-[9px] [writing-mode:vertical-lr] rotate-180 transition-colors duration-300 uppercase font-mono ${
                    active ? 'text-[#111] font-medium' : 'text-[#ccc] group-hover:text-[#111]'
                  }`}
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>

        <div className="h-10" />
      </motion.nav>

      {/* ── Mobile Top Bar ── */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-sm border-b border-[#ebebeb] flex md:hidden items-center justify-between px-6 z-50"
      >
        <button onClick={() => scrollTo('hero')} className="shrink-0 cursor-pointer">
          {mobileLogoContent}
        </button>
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 ml-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative shrink-0 cursor-pointer"
            >
              <span className={`text-[9px] tracking-widest font-mono transition-colors ${
                activeSection === item.id ? 'text-[#111]' : 'text-[#ccc]'
              }`}>
                {item.label}
              </span>
              {/* Mobile active underline */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="mobile-nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-[#111]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </motion.nav>
    </>
  );
};
