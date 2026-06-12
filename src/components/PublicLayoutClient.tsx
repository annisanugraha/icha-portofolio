'use client';

import { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { IntroSequence } from "@/components/animations/IntroSequence";
import { GrainOverlay } from "@/components/GrainOverlay";
import { ScrollChapterIndicator } from "@/components/ScrollChapterIndicator";

interface PublicLayoutClientProps {
  profile: any;
  children: React.ReactNode;
}

export function PublicLayoutClient({ profile, children }: PublicLayoutClientProps) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <IntroSequence onComplete={() => setShowIntro(false)} />
      ) : (
        <>
          <AnimatedBackground />
          <GrainOverlay />
          <ScrollChapterIndicator />
          <Navbar logoText={profile?.logoText} logoImage={profile?.logoImage} />
          {/* Padding md:pl-16 untuk memberikan ruang bagi sidebar desktop */}
          <div className="md:pl-16 flex flex-col min-h-screen">
            <div className="flex-1 relative z-10">
              {children}
            </div>
            <Footer profile={profile} />
          </div>
        </>
      )}
    </>
  );
}