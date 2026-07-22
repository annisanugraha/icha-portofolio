'use client';

import React, { useState } from 'react';
import { Certificate } from '@/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CertificateModal from './CertificateModal';

const CertificateCarousel = dynamic(() => import('./CertificateCarousel'), { ssr: false });

interface Props {
  certificates: Certificate[];
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function CertificateSection({ certificates }: Props) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  if (!certificates || certificates.length === 0) return null;

  const slideDeckCerts = certificates.filter(c => c.highlighted);
  const listCerts = certificates.filter(c => !c.highlighted);
  const visibleListCerts = listCerts.slice(0, 5);
  const hasMore = listCerts.length > 5;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-start">

        {/* Left Side: Slide Deck (50%) */}
        {slideDeckCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
            data-cursor="Click to inspect ↗"
          >
            <CertificateCarousel
              certificates={slideDeckCerts}
              onSelect={setSelectedCertificate}
            />
          </motion.div>
        )}

        {/* Right Side: Certificate List (50%) */}
        <div className="w-full flex flex-col pt-0 lg:pt-4">

          {/* List */}
          <div className="divide-y divide-[#e8e8e8]">
            {visibleListCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: 30, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, margin: '-5%' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setSelectedCertificate(cert)}
                data-cursor="Click to view ↗"
                className="group flex items-center gap-3 py-[10px] cursor-pointer hover:bg-[#f9f9f9] px-1 -mx-1 transition-colors duration-150"
              >
                {/* Bullet dot */}
                <div className="w-[5px] h-[5px] rounded-full bg-[#d0d0d0] group-hover:bg-[#555] shrink-0 transition-colors duration-150" />

                {/* Title + Category */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-[#111] group-hover:text-[#333] leading-snug truncate transition-colors">
                    {cert.title}
                  </p>
                  <p className="text-[10.5px] text-[#aaa] mt-[1px] font-mono truncate">
                    {cert.category}
                  </p>
                </div>

                {/* Date */}
                <p className="text-[10.5px] text-[#aaa] shrink-0 font-mono">
                  {formatDate(cert.createdAt)}
                </p>
              </motion.div>
            ))}

            {listCerts.length === 0 && (
              <p className="py-6 text-[#bbb] text-xs font-mono text-center">
                All certificates are in the slide deck.
              </p>
            )}
          </div>

          {/* See All button */}
          {(hasMore || slideDeckCerts.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-5%' }}
              transition={{
                duration: 0.6,
                delay: visibleListCerts.length * 0.1 + 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 pt-4 border-t border-[#ebebeb]"
            >
              <Link
                href="/archives"
                className="group inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-[#777] hover:text-[#111] transition-colors duration-200"
              >
                <span>See All Archives</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCertificate && (() => {
        const selectedIndex = certificates.findIndex(c => c.id === selectedCertificate.id);
        const hasNav = selectedIndex !== -1 && certificates.length > 1;
        return (
          <CertificateModal
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            onNext={hasNav ? () => setSelectedCertificate(certificates[(selectedIndex + 1) % certificates.length]) : undefined}
            onPrev={hasNav ? () => setSelectedCertificate(certificates[(selectedIndex - 1 + certificates.length) % certificates.length]) : undefined}
            currentIndex={hasNav ? selectedIndex : undefined}
            totalCount={hasNav ? certificates.length : undefined}
          />
        );
      })()}
    </div>
  );
}
