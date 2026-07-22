'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Activity } from '@/types';
import { motion, useInView } from 'framer-motion';

interface Props {
  activities: Activity[];
}

export default function ActivityGallery({ activities }: Props) {
  if (!activities || activities.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-10%' });

  // If 3 or fewer activities, render as clean static grid
  if (activities.length <= 3) {
    return (
      <div ref={ref} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-cursor="Touch grass ⸙">
        {activities.map((activity, i) => (
          <ActivityCard key={activity.id} activity={activity} index={i} isInView={isInView} inMarquee={false} />
        ))}
      </div>
    );
  }

  // If > 3 activities, render as infinite horizontal looping marquee (left to right)
  // Using 4 sets ensures exact -50% to 0% seamless loop math with zero gap seams
  const marqueeItems = [...activities, ...activities, ...activities, ...activities];

  return (
    <div className="mt-4 w-full overflow-hidden py-2 relative" data-cursor="Touch grass ⸙">
      <style jsx global>{`
        @keyframes activityMarquee {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .animate-activity-marquee {
          animation: activityMarquee 45s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-activity-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex gap-0 w-max animate-activity-marquee">
        {marqueeItems.map((activity, i) => (
          <div key={`${activity.id}-${i}`} className="w-[280px] md:w-[330px] lg:w-[360px] shrink-0 pr-6 md:pr-8">
            <ActivityCard
              activity={activity}
              index={i}
              isInView={true}
              inMarquee={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  index,
  isInView,
  inMarquee = false,
}: {
  activity: Activity;
  index: number;
  isInView: boolean;
  inMarquee?: boolean;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combine imageUrl and galleryImages
  const allImages = [];
  if (activity.imageUrl) allImages.push(activity.imageUrl);
  if (activity.galleryImages && activity.galleryImages.length > 0) {
    allImages.push(...activity.galleryImages);
  }

  // If no images at all, we'll still show a placeholder
  const hasImages = allImages.length > 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex < allImages.length - 1) {
      setActiveImageIndex(prev => prev + 1);
    } else {
      setActiveImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
    } else {
      setActiveImageIndex(allImages.length - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group flex flex-col gap-4 w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[#f5f5f5] border border-[#ebebeb]">
        {hasImages ? (
          <>
            <Image
              src={allImages[activeImageIndex]}
              fill
              alt={`${activity.title} - Image ${activeImageIndex + 1}`}
              className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Image Counter Badge (Editorial style) */}
            {allImages.length > 1 && (
              <div className="absolute top-3 right-3 z-20">
                <span className="flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase text-white drop-shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {activeImageIndex + 1} — {allImages.length}
                </span>
              </div>
            )}

            {/* Navigation Arrows (Minimalist lines on hover) */}
            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <button
                  onClick={prevImage}
                  className="w-10 h-1/2 flex items-center justify-start text-white/70 hover:text-white transition-colors"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={nextImage}
                  className="w-10 h-1/2 flex items-center justify-end text-white/70 hover:text-white transition-colors"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}

            {/* Thumbnail Previews (Clean Grid row, NOT overlapping) */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-3 z-20 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {allImages.slice(0, 5).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-8 h-8 md:w-10 md:h-10 overflow-hidden transition-all duration-300 ${activeImageIndex === idx
                      ? 'border border-white scale-100 brightness-110'
                      : 'border border-white/20 scale-95 brightness-50 hover:brightness-100'
                      }`}
                  >
                    <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
                {allImages.length > 5 && (
                  <div className="relative w-8 h-8 md:w-10 md:h-10 border border-white/20 bg-black/60 backdrop-blur-sm z-0 flex items-center justify-center">
                    <span className="text-white text-[8px] font-mono tracking-widest">+{allImages.length - 5}</span>
                  </div>
                )}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8e8e6] to-[#d0d0ce]" />
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#666]">
            {activity.year || '—'}
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#111] bg-[#f0f0f0] px-2 py-0.5 rounded-sm">
            {activity.event || 'Event'}
          </span>
        </div>
        <h4 className="text-sm md:text-xl font-serif text-[#111] leading-tight">
          {activity.title}
        </h4>
        {activity.description && (
          <p className="text-[11px] text-[#666] leading-relaxed line-clamp-2 mt-1">
            {activity.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
