'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Work', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Archives', path: '/archives' },
];

export const Navbar = ({ logoText, logoImage }: { logoText?: string | null; logoImage?: string | null }) => {
  const pathname = usePathname();

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
      {/* ── Desktop Sidebar ── */}
      <nav className="fixed left-0 top-0 bottom-0 w-16 hidden md:flex flex-col items-center justify-between py-10 bg-white border-r border-[#ebebeb] z-50">
        
        {/* Logo */}
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          {logoContent}
        </Link>

        {/* Nav Links */}
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className="group flex flex-col items-center gap-1.5"
              >
                {/* Active dot */}
                <div className={`w-px h-3 transition-all duration-500 ${active ? 'bg-[#111]' : 'bg-transparent'}`} />
                <span
                  className={`text-[9px] tracking-[0.3em] [writing-mode:vertical-lr] rotate-180 transition-colors duration-300 uppercase font-mono ${
                    active ? 'text-[#111] font-medium' : 'text-[#ccc] group-hover:text-[#111]'
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="h-10" />
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-sm border-b border-[#ebebeb] flex md:hidden items-center justify-between px-6 z-50">
        <Link href="/" className="flex-shrink-0">
          {mobileLogoContent}
        </Link>
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 ml-4">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[9px] tracking-widest font-mono transition-colors flex-shrink-0 ${
                pathname === link.path ? 'text-[#111]' : 'text-[#ccc] hover:text-[#111]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
