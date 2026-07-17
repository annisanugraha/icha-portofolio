'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Certificate } from '@/types';
import * as anime from 'animejs';
import { animate } from 'animejs';

interface Props {
  certificates: Certificate[];
}

export default function CertificateCarousel({ certificates }: Props) {
  // Guard wajib di baris pertama komponen (Keputusan 5)
  if (!certificates || certificates.length === 0) return null;

  const isStaticMode = certificates.length <= 2; // render sederhana tanpa 3D rotate & tanpa tombol nav
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  function positionCards(newActive: number, animated: boolean) {
    const total = certificates.length;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      let offset = i - newActive;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const translateX = offset * 55;
      const rotateY = offset * 35;
      const scale = offset === 0 ? 1.0 : 0.80;
      const opacity = Math.abs(offset) > 1 ? 0 : (offset === 0 ? 1 : 0.65);
      const zIndex = offset === 0 ? 10 : (5 - Math.abs(offset));
      const translateZ = offset === 0 ? 0 : -120;

      card.style.zIndex = String(zIndex);

      if (animated) {
        setIsAnimating(true);
        try {
          if (typeof animate === 'function') {
            animate(card, {
              translateX: `${translateX}%`,
              rotateY: rotateY,
              scale: scale,
              opacity: opacity,
              translateZ: translateZ,
              duration: 600,
              ease: 'outCubic',
              onComplete: () => setIsAnimating(false)
            });
          } else if (anime && typeof (anime as any).animate === 'function') {
            (anime as any).animate(card, {
              translateX: `${translateX}%`,
              rotateY: rotateY,
              scale: scale,
              opacity: opacity,
              translateZ: translateZ,
              duration: 600,
              ease: 'outCubic',
              onComplete: () => setIsAnimating(false)
            });
          } else {
            card.style.transform = `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
            card.style.opacity = String(opacity);
            card.style.transition = 'all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)';
            setIsAnimating(false);
          }
        } catch (e) {
          card.style.transform = `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.transition = 'all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)';
          setIsAnimating(false);
        }
      } else {
        card.style.transform = `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.transition = 'none';
      }
    });
  }

  function rotate(direction: 'next' | 'prev') {
    if (isAnimating) return;
    const total = certificates.length;
    const newActive = direction === 'next'
      ? (activeIndex + 1) % total
      : (activeIndex - 1 + total) % total;
    setActiveIndex(newActive);
    positionCards(newActive, true);
  }

  useEffect(() => {
    if (!isStaticMode) {
      positionCards(activeIndex, false);
    }
  }, [certificates, isStaticMode]);

  if (isStaticMode) {
    return (
      <div className="flex flex-wrap justify-center items-center gap-6 py-8">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="w-[300px] md:w-[360px] aspect-[3/4] rounded-md overflow-hidden border border-[#ebebeb] bg-white shadow-lg relative flex flex-col justify-end"
          >
            <Image
              src={cert.imageUrl || '/placeholder.png'}
              fill
              alt={cert.title || 'Certificate'}
              className="object-cover"
              sizes="(max-width: 768px) 300px, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white z-10">
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-75 mb-1 block">
                {cert.category || 'Recognition'}
              </span>
              <h4 className="font-serif text-lg leading-tight">{cert.title}</h4>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-[480px] md:h-[540px] w-full flex items-center justify-center overflow-visible [perspective:1000px]">
      {certificates.map((cert, i) => (
        <div
          key={cert.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="coverflow-card absolute w-[300px] md:w-[360px] aspect-[3/4] rounded-md overflow-hidden border border-[#ebebeb] bg-white shadow-xl cursor-pointer will-change-transform"
          onClick={() => {
            if (i !== activeIndex && !isAnimating) {
              setActiveIndex(i);
              positionCards(i, true);
            }
          }}
        >
          <Image
            src={cert.imageUrl || '/placeholder.png'}
            fill
            alt={cert.title || 'Certificate'}
            className="object-cover"
            sizes="(max-width: 768px) 300px, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white z-10">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-75 mb-1 block">
              {cert.category || 'Recognition'}
            </span>
            <h4 className="font-serif text-lg leading-tight">{cert.title}</h4>
          </div>
        </div>
      ))}

      <button
        aria-label="Sertifikat sebelumnya"
        onClick={() => rotate('prev')}
        className="absolute left-2 sm:left-4 z-20 w-10 h-10 rounded-full border border-[#ebebeb] bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111] hover:bg-[#111] hover:text-white transition-all shadow-md cursor-pointer"
      >
        ←
      </button>
      <button
        aria-label="Sertifikat berikutnya"
        onClick={() => rotate('next')}
        className="absolute right-2 sm:right-4 z-20 w-10 h-10 rounded-full border border-[#ebebeb] bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111] hover:bg-[#111] hover:text-white transition-all shadow-md cursor-pointer"
      >
        →
      </button>
    </div>
  );
}
