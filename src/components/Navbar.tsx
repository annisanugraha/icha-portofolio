'use client';

import { useState, useEffect } from 'react';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'archives', label: 'Archives' },
  { id: 'play', label: 'Play' },
];

export const Navbar = ({ logoText, logoImage }: { logoText?: string | null; logoImage?: string | null }) => {
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'work', 'archives', 'play'];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible (highest ratio) in the middle zone
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by how close to center of viewport
          const sorted = visibleEntries.sort((a, b) => {
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            const viewportCenter = window.innerHeight / 2;
            const aCenter = Math.abs(aRect.top + aRect.height / 2 - viewportCenter);
            const bCenter = Math.abs(bRect.top + bRect.height / 2 - viewportCenter);
            return aCenter - bCenter;
          });
          setActiveSection(sorted[0].target.id);
        }
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
    // Use hash-based navigation for cross-page scrolling
    const hash = `#${id}`;
    const currentHash = window.location.hash;

    // Scroll helper function
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 48 : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    if (currentHash !== hash) {
      // Set hash and scroll with small delay to allow hash to take effect
      window.location.hash = hash;
      setTimeout(doScroll, 50);
    } else {
      // Already on the right page, just scroll
      doScroll();
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
      <nav className="fixed left-0 top-0 bottom-0 w-16 hidden md:flex flex-col items-center justify-between py-10 bg-white border-r border-[#ebebeb] z-50">

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
                className="group flex flex-col items-center gap-1.5 cursor-pointer"
              >
                {/* Active dot */}
                <div className={`w-px h-3 transition-all duration-500 ${active ? 'bg-[#111]' : 'bg-transparent'}`} />
                <span
                  className={`text-[9px] tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 transition-colors duration-300 uppercase font-mono ${
                    active ? 'text-[#111] font-medium' : 'text-[#ccc] group-hover:text-[#111]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-10" />
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-sm border-b border-[#ebebeb] flex md:hidden items-center justify-between px-6 z-50">
        <button onClick={() => scrollTo('hero')} className="shrink-0 cursor-pointer">
          {mobileLogoContent}
        </button>
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 ml-4">
          {navItems.map((item) => (
<button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-[9px] tracking-widest font-mono transition-colors shrink-0 ${
                activeSection === item.id ? 'text-[#111]' : 'text-[#ccc]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
