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

  // Scroll spy using scroll event
  useEffect(() => {
    const sections = ['hero', 'about', 'work', 'archives', 'play'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let current = 'hero';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    // Use hash-based navigation for cross-page scrolling
    const hash = `#${id}`;
    const currentHash = window.location.hash;

    if (currentHash !== hash) {
      // Navigate to home with hash, then scroll
      window.location.hash = hash;
    } else {
      // Already on the right page, just scroll
      const el = document.getElementById(id);
      if (el) {
        // Offset:64px for mobile top bar,0 for desktop sidebar (it's on the side)
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 48 : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
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
        <div className="flex flex-col items-center gap-8">
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
