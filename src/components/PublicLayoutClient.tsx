'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { IntroSequence } from "@/components/animations/IntroSequence";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ScrollChapterIndicator } from "@/components/ScrollChapterIndicator";
import { SmoothCursor } from "@/components/SmoothCursor";
import { LenisProvider } from "@/components/LenisProvider";
import type { Profile } from '@/types';

interface PublicLayoutClientProps {
  profile: Profile | null;
  children: React.ReactNode;
}

export function PublicLayoutClient({ profile, children }: PublicLayoutClientProps) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    const hasSeenIntro = sessionStorage.getItem('icha-has-seen-intro');
    
    // Skip intro if there is a hash link (e.g. #play) or already seen in this session
    if (hash || hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('icha-has-seen-intro', 'true');
  };

  return (
    <>
      {showIntro ? (
        <IntroSequence onComplete={handleIntroComplete} />
      ) : (
        <LenisProvider>
          <AnimatedBackground />
          <GrainOverlay />
          <ScrollChapterIndicator />
          <SmoothCursor />
          <Navbar logoText={profile?.logoText} logoImage={profile?.logoImage} />
          {/* Padding md:pl-16 untuk memberikan ruang bagi sidebar desktop */}
          <div className="md:pl-16 flex flex-col min-h-screen">
            <div className="flex-1 relative z-10">
              {children}
            </div>
            <Footer profile={profile} />
          </div>
        </LenisProvider>
      )}
    </>
  );
}