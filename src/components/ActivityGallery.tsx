'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Activity } from '@/types';
import * as anime from 'animejs';
import { animate, stagger } from 'animejs';

interface Props {
  activities: Activity[];
}

export default function ActivityGallery({ activities }: Props) {
  if (!activities || activities.length === 0) return null;

  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        try {
          if (typeof animate === 'function' && typeof stagger === 'function') {
            animate('.activity-gallery-item', {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.95, 1],
              duration: 700,
              delay: stagger(100),
              ease: 'outCubic',
            });
          } else if (anime && typeof (anime as any).animate === 'function') {
            (anime as any).animate('.activity-gallery-item', {
              opacity: [0, 1],
              translateY: [30, 0],
              scale: [0.95, 1],
              duration: 700,
              delay: (anime as any).stagger ? (anime as any).stagger(100) : 0,
              ease: 'outCubic',
            });
          } else {
            document.querySelectorAll('.activity-gallery-item').forEach((item) => {
              (item as HTMLElement).style.opacity = '1';
              (item as HTMLElement).style.transform = 'translateY(0) scale(1)';
            });
          }
        } catch (e) {
          document.querySelectorAll('.activity-gallery-item').forEach((item) => {
            (item as HTMLElement).style.opacity = '1';
            (item as HTMLElement).style.transform = 'translateY(0) scale(1)';
          });
        }
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, [activities]);

  return (
    <div
      ref={galleryRef}
      className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#ddd] [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {activities.map((activity, i) => {
        const pattern = i % 3;
        let widthClass: string;
        if (pattern === 0) widthClass = 'w-[300px] md:w-[360px]';
        else if (pattern === 1) widthClass = 'w-[170px] md:w-[200px]';
        else widthClass = 'w-[260px] md:w-[300px]';

        return (
          <div
            key={activity.id}
            className={`activity-gallery-item shrink-0 ${widthClass} h-[220px] rounded-md overflow-hidden border border-[#ebebeb] bg-[#fafafa] relative flex flex-col justify-end group snap-start shadow-sm transition-all hover:shadow-md`}
          >
            {activity.imageUrl ? (
              <Image
                src={activity.imageUrl}
                fill
                alt={activity.title || 'Activity'}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 300px, 360px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white z-10">
              <h4 className="font-serif text-base leading-tight mb-1 line-clamp-2">
                {activity.title}
              </h4>
              <span className="text-[11px] opacity-75 block truncate">
                {activity.event} {activity.year ? `· ${activity.year}` : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
