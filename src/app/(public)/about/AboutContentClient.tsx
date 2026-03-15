'use client';

import { motion } from 'framer-motion';

export default function AboutContentClient({ profile }: { profile: any }) {
  return (
    <section className="min-h-screen flex items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-4 items-center w-full py-12"
      >
        {/* Text Content */}
        <div className="md:col-span-6 space-y-6">
          <span className="label">Persona</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">Who I Am.</h1>

          <div className="space-y-4 max-w-xl">
            <p className="text-sm italic text-[#111] border-l border-[#111] pl-5 leading-relaxed">
              &quot;{profile?.aboutQuote || 'Crafting digital clarity through intentional code.'}&quot;
            </p>
            <p className="text-xs text-[#777] leading-relaxed whitespace-pre-line">
              {profile?.aboutBio1 || 'Saya adalah Fullstack Engineer yang berdedikasi...'}
            </p>
            <p className="text-xs text-[#777] leading-relaxed whitespace-pre-line">
              {profile?.aboutBio2}
            </p>
          </div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="md:col-span-4 flex justify-center md:justify-start"
        >
          <div className="img-container aspect-square w-full max-w-[380px] rounded-sm overflow-hidden">
            <img
              src={profile?.aboutImage || "https://placehold.co/600x600/f5f5f5/999999?text=—"}
              alt="Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
