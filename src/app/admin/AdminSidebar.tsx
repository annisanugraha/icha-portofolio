'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menu = [
  { group: 'OVERVIEW', items: [{ name: 'Dashboard', path: '/admin', icon: '◈' }] },
  { group: 'CONTENT', items: [
    { name: 'Identity', path: '/admin/profile', icon: '◉' },
    { name: 'Portfolio', path: '/admin/projects', icon: '◧' },
    { name: 'Archives', path: '/admin/archives', icon: '◫' },
    { name: 'Timeline', path: '/admin/timeline', icon: '◎' },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  if (pathname === '/admin/login') return null;

  return (
    <aside className="w-56 shrink-0 border-r border-[#ebebeb] flex flex-col sticky top-0 h-screen">
      
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#ebebeb]">
        <p className="text-sm font-medium text-[#111] tracking-wide">Admin Panels</p>
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
      <div className="px-4 py-6 border-t border-[#ebebeb] space-y-3">
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
  );
}
