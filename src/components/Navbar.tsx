'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Work', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Archives', path: '/archives' },
];

// Hanya tambahkan Admin jika mode ADMIN aktif
const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'PUBLIC';
if (appMode === 'ADMIN') {
  links.push({ name: 'Admin', path: '/admin' });
}

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="fixed left-0 top-0 bottom-0 w-16 hidden md:flex flex-col items-center justify-between py-10 bg-white border-r border-[#ebebeb] z-50">
        
        {/* Logo */}
        <Link href="/" className="font-mono font-medium text-[10px] tracking-widest text-[#111]">
          GSA
        </Link>

        {/* Nav Links */}
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.path;
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

        {/* Copyright */}
        <span className="text-[7px] text-[#ddd] [writing-mode:vertical-lr] rotate-180 tracking-widest font-mono">
          © 2026
        </span>
      </nav>

      {/* ── Mobile Top Bar ── */}
      <nav className="fixed top-0 left-0 right-0 h-12 bg-white/90 backdrop-blur-sm border-b border-[#ebebeb] flex md:hidden items-center justify-between px-6 z-50">
        <Link href="/" className="font-mono font-medium text-[10px] tracking-widest">
          GSA
        </Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[9px] tracking-widest font-mono transition-colors ${
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