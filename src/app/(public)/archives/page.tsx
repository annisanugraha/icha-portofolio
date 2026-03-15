// src/app/(public)/archives/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CertificateGrid } from '@/components/CertificateGrid';
import { getCertificates } from '@/actions/certificate';
import { motion } from 'framer-motion';

export default function ArchivesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    getCertificates().then(setCertificates);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="main-container pt-24 pb-32 space-y-16">

        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-3"
        >
          <span className="label">Validation</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">Archives.</h1>
          <p className="text-xs md:text-sm text-[#999] leading-relaxed">
            Certifications, honors, and formal recognitions accumulated through the professional journey.
          </p>
        </motion.div>

        <section className="border-t border-[#ebebeb] pt-16">
          <CertificateGrid certificates={certificates} />
        </section>

      </div>
    </main>
  );
}
