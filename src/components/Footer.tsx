'use client';

import React from 'react';
import { motion, animate } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  profile: any;
}

export const Footer = ({ profile }: FooterProps) => {
  const scrollToTop = () => {
    document.documentElement.style.scrollBehavior = 'auto';
    animate(window.scrollY, 0, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => { document.documentElement.style.scrollBehavior = ''; }
    });
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: profile?.linkedinUrl || '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      name: 'Github',
      href: profile?.githubUrl || '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.533-1.305.991-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      name: 'Gmail',
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile?.emailAddress || ''}&su=${encodeURIComponent(profile?.emailSubject || '')}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, margin: '-5%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-[#ebebeb] py-8 mt-12"
    >
      <div className="px-6 md:px-12 w-full flex justify-between items-center  gap-4">
        
        {/* Social Links — staggered entrance with hover micro-animations */}
        <div className="flex items-center gap-6 md:gap-10">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[#999] hover:text-black transition-colors"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
              <span className="hidden md:inline text-[10px] font-black tracking-[0.3em] group-hover:text-black transition-colors uppercase">
                {link.name}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Right side — copyright + back to top */}
        <div className="flex items-center gap-6">
          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="group flex items-center gap-2 text-[#bbb] hover:text-[#111] transition-colors cursor-pointer"
          >
            <span className="hidden md:inline text-[8px] font-mono tracking-[0.4em] uppercase">
              Back to top
            </span>
            <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>

          {/* Copyright */}
          <div className="text-right shrink-0">
            <p className="text-[8px] md:text-[9px] font-bold tracking-[0.4em] text-[#bbb] uppercase">
              © 2026 {profile?.logoText || 'Annisa Nugraha'}
            </p>
          </div>
        </div>

      </div>
    </motion.footer>
  );
};
