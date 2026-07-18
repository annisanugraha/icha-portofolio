'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Certificate } from '@/types';
import * as anime from 'animejs';
import { animate } from 'animejs';

interface Props {
  certificates: Certificate[];
  onSelect?: (cert: Certificate) => void;
}

export default function CertificateCarousel({ certificates, onSelect }: Props) {
  // Guard wajib di baris pertama komponen (Keputusan 5)
  if (!certificates || certificates.length === 0) return null;

  const isStaticMode = certificates.length <= 2; // render sederhana tanpa 3D rotate & tanpa tombol nav
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  // Auto rotation
  useEffect(() => {
    if (isStaticMode || isHovered) return;
    
    const interval = setInterval(() => {
      rotate('next');
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval);
  }, [activeIndex, isHovered, isStaticMode, isAnimating]);

  if (isStaticMode) {
    return (
      <div className="flex flex-wrap justify-center items-center gap-6 py-8">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => onSelect && onSelect(cert)}
            className="w-[280px] md:w-[340px] aspect-[4/3] rounded-md overflow-hidden border border-[#ebebeb] bg-white shadow-lg relative flex flex-col justify-end cursor-pointer hover:border-[#111] transition-colors"
          >
            <Image
              src={cert.imageUrl || '/placeholder.png'}
              fill
              alt={cert.title || 'Certificate'}
              className="object-cover"
              sizes="(max-width: 768px) 300px, 360px"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="relative h-[300px] md:h-[340px] w-full flex items-center justify-center overflow-visible [perspective:1000px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {certificates.map((cert, i) => (
        <div
          key={cert.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="coverflow-card absolute w-[260px] md:w-[320px] aspect-[4/3] rounded-md overflow-hidden border border-[#ebebeb] bg-white shadow-xl cursor-pointer will-change-transform"
          onClick={() => {
            if (i !== activeIndex && !isAnimating) {
              setActiveIndex(i);
              positionCards(i, true);
            } else if (i === activeIndex && onSelect) {
              onSelect(cert);
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
        </div>
      ))}

    </div>
  );
}
