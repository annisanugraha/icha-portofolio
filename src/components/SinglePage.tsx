'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PageSectionHeader } from './PageSectionHeader';
import { WorkAndSkills } from './WorkAndSkills';
import { HeroSection } from './HeroSection';
import type { Profile, Project, Certificate, Experience, Activity } from '@/types';

const CertificateSection = dynamic(() => import('./CertificateSection'), { ssr: false });
const ActivityGallery = dynamic(() => import('./ActivityGallery'), { ssr: false });
const PlaySection = dynamic(() => import('./PlaySection').then((mod) => mod.PlaySection), { ssr: false });

interface SinglePageProps {
  profile: Profile | null;
  projects: Project[];
  certificates: Certificate[];
  activities: Activity[];
  experiences: Experience[];
}

const SECTION_IDS = ['hero', 'about', 'work', 'archives', 'play', 'contact'];

export function SinglePage({ profile, projects, certificates, activities, experiences }: SinglePageProps) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const isPortraitInView = useInView(portraitRef, { once: false, margin: '0px' });

  // Scroll to the section referenced by the URL hash on first load, then clean the hash
  // so a page refresh doesn't force-scroll again.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || !SECTION_IDS.includes(hash)) return;

    const scrollToHash = () => {
      const el = document.getElementById(hash);
      if (!el) return;
      const offset = window.innerWidth < 768 ? 48 : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'auto' });
    };

    scrollToHash();
    const retries = [100, 500, 1500].map((delay) => setTimeout(scrollToHash, delay));
    const cleanup = setTimeout(() => history.replaceState(null, '', window.location.pathname), 1700);

    return () => {
      retries.forEach(clearTimeout);
      clearTimeout(cleanup);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div>
        {/* Hero & About share a sticky wrapper */}
        <div id="hero" className="relative z-0 bg-white">
          {/* 01 — Hero */}
          <HeroSection profile={profile} />

          <div id="about" className="relative z-10">
            {/* 02 — About */}
            <section className="relative z-10 flex min-h-screen flex-col justify-center bg-[#111] py-24 text-white md:pt-16">
              <div className="px-6 md:px-12">
                <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-10 md:gap-4">
                  <div className="space-y-6 md:col-span-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: '-10%' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-2"
                    >
                      <span className="label !border-white/20 !text-white/50">About</span>
                      <h2 className="font-serif text-4xl tracking-tight !text-white md:text-5xl">Who I Am.</h2>
                    </motion.div>

                    <div className="max-w-xl space-y-4">
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="border-l-2 border-white pl-5 text-sm italic leading-relaxed text-white"
                      >
                        &ldquo;{profile?.aboutQuote ?? 'Crafting digital clarity through intentional code.'}&rdquo;
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="whitespace-pre-line text-xs leading-relaxed text-[#bbb]"
                      >
                        {profile?.aboutBio1}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="whitespace-pre-line text-xs leading-relaxed text-[#bbb]"
                      >
                        {profile?.aboutBio2}
                      </motion.p>
                    </div>
                  </div>

                  {/* Portrait — mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-full justify-center md:hidden"
                  >
                    <div className="img-container relative aspect-square w-full max-w-[320px] overflow-hidden rounded-sm">
                      <Image
                        src={profile?.aboutImage || 'https://placehold.co/600x600/f5f5f5/999999?text=—'}
                        alt="Portrait"
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Portrait — desktop, curtain reveal */}
                  <div ref={portraitRef} className="hidden justify-center md:col-span-4 md:flex md:justify-start">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isPortraitInView ? 1 : 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      data-cursor="It's me ♡"
                      className="group relative aspect-square w-full max-w-[380px] overflow-hidden rounded-sm"
                    >
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: isPortraitInView ? '101%' : 0 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        style={{ willChange: 'transform' }}
                        className="absolute inset-0 z-10 bg-white"
                      />
                      <motion.div
                        initial={{ scale: 1.15 }}
                        animate={{ scale: isPortraitInView ? 1 : 1.15 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        className="relative h-full w-full grayscale transition-all duration-1000 group-hover:grayscale-0"
                      >
                        <Image
                          src={profile?.aboutImage || 'https://placehold.co/600x600/f5f5f5/999999?text=—'}
                          alt="Portrait"
                          fill
                          sizes="(min-width: 768px) 380px, 100vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* 02.5 — Chronology */}
            <section className="relative z-10 bg-white py-16 text-[#111]">
              <div className="px-6 md:px-12">
                {experiences && experiences.length > 0 && (
                  <div className="mt-0 space-y-0" data-cursor="What a journey... ✩">
                    <PageSectionHeader title="Chronology" number="02" />
                    <div className="flex flex-col">
                      {experiences.map((exp, i) => {
                        const isLast = i === experiences.length - 1;
                        return (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: '-5%' }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group flex items-start"
                          >
                            <div className="hidden w-48 shrink-0 pt-1 md:block">
                              {exp.imageUrl ? (
                                <div className="aspect-video w-full overflow-hidden border border-[#ebebeb] bg-[#fafafa] opacity-80 grayscale transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:grayscale-0">
                                  <img
                                    src={exp.imageUrl}
                                    alt={exp.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                </div>
                              ) : (
                                <div className="flex aspect-video w-full items-center justify-center border border-[#ebebeb] bg-[#fafafa]">
                                  <span className="font-mono text-[6px] uppercase tracking-widest text-[#ddd]">N/A</span>
                                </div>
                              )}
                            </div>

                            <div className="mr-6 flex shrink-0 flex-col items-center self-stretch md:mx-10">
                              <motion.div
                                whileInView={{ scale: [0, 1.3, 1] }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                                className="mt-[5px] h-2 w-2 rounded-full bg-[#111] transition-colors duration-500 group-hover:bg-[#ddd]"
                              />
                              <div className={`w-[0.5px] flex-1 bg-[#ebebeb] ${isLast ? 'opacity-0' : 'opacity-100'}`} />
                            </div>

                            <div className="flex-1 space-y-4 pb-10 pt-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#111] transition-opacity duration-500 group-hover:opacity-70 md:text-[11px]">
                                  [{exp.year}]
                                </span>
                                <h4 className="font-mono text-[11px] tracking-tight text-[#111] transition-opacity duration-500 group-hover:opacity-70 md:text-[12px]">
                                  {exp.title}
                                </h4>
                              </div>
                              <p className="line-clamp-3 pr-4 font-sans text-[11px] leading-relaxed text-[#777] md:line-clamp-none md:pr-12 md:text-[12px]">
                                {exp.description}
                              </p>
                              <span className="font-mono text-[8px] italic tracking-[0.4em] text-[#bbb] transition-colors group-hover:text-[#999]">
                                at {exp.company}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div id="work">
          {/* 03 — Work */}
          <WorkAndSkills projects={projects} />
        </div>

        <div id="play">
          {/* 04 — Play */}
          <section className="relative flex min-h-screen flex-col pb-6 pt-6 md:h-[100dvh]">
            <div className="flex flex-1 flex-col px-6 md:min-h-0 md:px-12">
              <PageSectionHeader title="LET'S TAKE A BREAK" number="04" />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 flex flex-1 flex-col md:min-h-0"
              >
                <PlaySection />
              </motion.div>
            </div>
          </section>
        </div>

        <div id="archives">
          {/* 05 — Archives */}
          {certificates && certificates.length > 0 && (
            <section className="md:pt-6">
              <div className="px-6 md:px-12">
                <PageSectionHeader title="Archives" number="05" />
                <h3 className="mb-2 font-serif text-3xl text-[#111] md:text-4xl">Something meaningful.</h3>
                <p className="font-mono text-xs text-[#777]">
                  I&apos;ve always believed that recognition is a testament to our efforts.
                </p>
                <div className="py-4">
                  <CertificateSection certificates={certificates} />
                </div>
              </div>
            </section>
          )}

          {activities && activities.length > 0 && (
            <section className="mb-24 mt-4">
              <div className="px-6 md:px-12">
                <div>
                  <h3 className="mb-2 font-serif text-3xl text-[#111] md:text-4xl">Life outside the editor.</h3>
                  <p className="font-mono text-xs text-[#777]">Work, learn, repeat.</p>
                </div>
                <div className="pt-0">
                  <ActivityGallery activities={activities} />
                </div>
              </div>
            </section>
          )}
        </div>

        <div id="contact">
          {/* 06 — Contact */}
          <section className="section-dark relative flex min-h-[60vh] flex-col justify-center overflow-hidden bg-[#0a0a0a] py-24 text-white">
            <div className="z-10 px-6 md:px-12">
              <div className="max-w-lg space-y-6">
                <motion.h2
                  initial={{ opacity: 0, scale: 1.1, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, margin: '-10%' }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-5xl uppercase leading-none tracking-tight text-white md:text-7xl"
                >
                  YOU MADE IT.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-5%' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base font-light text-gray-400"
                >
                  Thanks for scrolling all the way down! Since you&apos;re already here, we should definitely talk, right?
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-5%' }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-6 pt-4"
                >
                  {profile?.resumeUrl ? (
                    <button
                      onClick={async () => {
                        const urlStr = profile?.resumeUrl;
                        if (!urlStr) return;
                        try {
                          const response = await fetch(urlStr);
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'Resume_Annisa Angelica Nugraha.pdf';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        } catch {
                          window.open(urlStr, '_blank');
                        }
                      }}
                      className="group inline-flex cursor-pointer items-center gap-3 bg-white px-8 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#111] shadow-lg transition-all duration-500 hover:bg-[#eee]"
                    >
                      <span>Save My Resume</span>
                      <motion.span
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        ↓
                      </motion.span>
                    </button>
                  ) : (
                    <span className="text-[10px] italic uppercase tracking-[0.3em] text-[#666]">
                      Resume not available yet
                    </span>
                  )}
                </motion.div>
              </div>

              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute -bottom-1/2 left-1/4 h-[600px] w-[600px] rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}