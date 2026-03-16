import React from 'react';
import { Timeline } from '@/components/Timeline';
import { getProfile, getExperiences } from '@/actions/profile';
import AboutContentClient from './AboutContentClient';

export default async function AboutPage() {
  const profile = await getProfile();
  const experiences = await getExperiences();

  return (
    <main className="min-h-screen bg-white">
      <div className="main-container pt-24 md:pt-0">
        
        {/* Intro Section: Client component for animations */}
        <AboutContentClient profile={profile} />

        {/* Timeline Section */}
        <section className="border-t border-[#ebebeb] pt-24">
          <Timeline experiences={experiences} />
        </section>

      </div>
    </main>
  );
}
