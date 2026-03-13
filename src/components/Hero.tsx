'use client';

import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center">
      <div className="main-container -mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="space-y-8 max-w-2xl"
        >
          <span className="label">Software Engineer</span>

          <h1 className="leading-[1.0]">
            Building things<br />
            <em>that matter.</em>
          </h1>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-6 h-px bg-[#111]" />
            <p className="text-xs text-[#999] tracking-wide">
              Engineering & minimal design.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
