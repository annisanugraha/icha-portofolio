'use client';

import { motion } from 'framer-motion';

export const Hero = ({ profile }: { profile: any }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center">
      <div className="-mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="space-y-8 max-w-2xl"
        >
          {/* Mengambil data 'Role' dari CMS */}
          <span className="label">{profile?.heroRole || 'Software Engineer'}</span>

          {/* Mengambil data 'Title' dari CMS. whitespace-pre-line agar Enter/Baris baru berfungsi */}
          <h1 className="leading-[1.0] whitespace-pre-line">
            {profile?.heroTitle || 'Building things that matter.'}
          </h1>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-6 h-px bg-[#111]" />
            <p className="text-xs text-[#999] tracking-wide">
              {/* Mengambil data 'Subtitle' dari CMS */}
              {profile?.heroSubtitle || 'Engineering & minimal design.'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
