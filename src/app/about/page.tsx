'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/Timeline';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="main-container">
        
        {/* ── Intro Section: Full Viewport ── */}
        <section className="min-h-screen flex items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center w-full py-20"
          >
            {/* Text Content */}
            <div className="md:col-span-7 space-y-8">
              <span className="label">Persona</span>
              <h1>Who I Am.</h1>

              <div className="space-y-6 max-w-md">
                <p className="text-sm italic text-[#111] border-l border-[#111] pl-5 leading-relaxed">
                  &quot;Crafting digital clarity through intentional code.&quot;
                </p>
                <p className="text-xs text-[#777] leading-relaxed">
                  Saya adalah Fullstack Engineer yang berdedikasi pada penciptaan solusi digital
                  yang tidak hanya berfungsi secara teknis, tapi juga memberikan ketenangan visual.
                </p>
                <p className="text-xs text-[#777] leading-relaxed">
                  Melalui <span className="text-[#111] border-b border-[#ddd]">Bengkel Koding</span>,
                  saya belajar bahwa setiap baris kode harus memiliki tujuan.
                </p>
              </div>
            </div>

            {/* Portrait: aspect-square for balance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3 }}
              className="md:col-span-5 flex justify-center md:justify-end"
            >
              <div className="img-container aspect-square w-full max-w-[360px] rounded-sm overflow-hidden">
                <img
                  src="https://placehold.co/600x600/f5f5f5/999999?text=—"
                  alt="Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Timeline Section ── */}
        <section className="border-t border-[#ebebeb] pt-24 pb-32">
          <Timeline />
        </section>

      </div>
    </main>
  );
}
