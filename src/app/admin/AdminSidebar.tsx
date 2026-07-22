'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const menu = [
  { group: 'OVERVIEW', items: [{ name: 'Dashboard', path: '/admin', icon: '◈' }] },
  { group: 'CONTENT', items: [
    { name: 'Identity', path: '/admin/profile', icon: '◉' },
    { name: 'Portfolio', path: '/admin/projects', icon: '◧' },
    { name: 'Skills', path: '/admin/skills', icon: '✦' },
    { name: 'Activities', path: '/admin/activities', icon: '◪' },
    { name: 'Archives', path: '/admin/archives', icon: '◫' },
    { name: 'Timeline', path: '/admin/timeline', icon: '◎' },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes and handle body scroll
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (pathname === '/admin/login') return null;

  return (
    <>
      {/* --- MOBILE TOP DROPDOWN --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white border-b border-[#ebebeb] font-mono">
        <div className="flex items-center justify-between px-6 h-16">
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#111]">Admin Panels</p>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-[9px] tracking-[0.3em] uppercase border border-[#111] px-3 py-1.5 transition-all hover:bg-[#111] hover:text-white"
          >
            {isOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden bg-white border-t border-[#ebebeb]"
            >
              <div className="p-6 space-y-8">
                {/* Stack Menu */}
                <div className="space-y-1">
                  {menu.flatMap(g => g.items).map((item) => {
                    const active = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 text-[11px] tracking-widest uppercase transition-all rounded-sm ${
                          active
                            ? 'bg-[#111] text-white font-medium'
                            : 'text-[#666] hover:text-[#111] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        <span className="text-[10px]">{item.icon}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Footer Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-3 border border-[#ebebeb] text-[9px] tracking-widest uppercase text-[#999] hover:text-[#111] transition-colors"
                  >
                    <span>↗</span> Live Site
                  </Link>
                  <button
                    onClick={async () => {
                      const { logoutAdmin } = await import('@/actions/auth');
                      await logoutAdmin();
                      window.location.href = '/admin/login';
                    }}
                    className="flex items-center justify-center gap-2 py-3 border border-[#ebebeb] text-[9px] tracking-widest uppercase text-[#999] hover:text-red-500 transition-colors"
                  >
                    <span>×</span> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-56 shrink-0 border-r border-[#ebebeb] flex-col sticky top-0 h-screen font-mono">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-[#ebebeb]">
          <p className="text-sm font-medium text-[#111] tracking-wide uppercase">Admin Panels</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menu.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="text-[8px] tracking-[0.5em] text-[#ccc] px-2 mb-3 uppercase">{group.group}</p>
              {group.items.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase transition-all rounded-sm ${
                      active
                        ? 'bg-[#111] text-white font-medium'
                        : 'text-[#666] hover:text-[#111] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <span className="text-[10px]">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-[#ebebeb] space-y-3 bg-white">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-[10px] tracking-widest uppercase text-[#999] hover:text-[#111] transition-colors"
          >
            <span>↗</span> Live Site
          </Link>
          <button
            onClick={async () => {
              const { logoutAdmin } = await import('@/actions/auth');
              await logoutAdmin();
              window.location.href = '/admin/login';
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] tracking-widest uppercase text-[#999] hover:text-red-500 transition-colors text-left cursor-pointer"
          >
            <span>×</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
