'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageSectionHeader } from './PageSectionHeader';
import { WorkAndSkills } from './WorkAndSkills';
import type { Profile, Project, Certificate, Experience, Activity } from '@/types';

const SplineScene = dynamic(() => import('./SplineScene').then(mod => mod.SplineScene), {
  ssr: false,
  loading: () => null, // Silent — no spinner in hero area
});
const CertificateSection = dynamic(() => import('./CertificateSection'), { ssr: false });
const ActivityGallery = dynamic(() => import('./ActivityGallery'), { ssr: false });
const PlaySection = dynamic(() => import('./PlaySection').then(mod => mod.PlaySection), { ssr: false });

interface SinglePageProps {
  profile: Profile | null;
  projects: Project[];
  certificates: Certificate[];
  activities: Activity[];
  experiences: Experience[];
}

export function SinglePage({ profile, projects, certificates, activities, experiences }: SinglePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroTitleY = useTransform(heroScrollProgress, [0, 1], [0, -100]);
  const heroSubtitleY = useTransform(heroScrollProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);

  const portraitRef = useRef<HTMLDivElement>(null);
  const isPortraitInView = useInView(portraitRef, { once: false, margin: "0px" });

  // Handle hash-based scroll on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['hero', 'about', 'work', 'archives', 'play', 'contact'].includes(hash)) {
      const scrollToHash = () => {
        const el = document.getElementById(hash);
        if (el) {
          const offset = window.innerWidth < 768 ? 48 : 0;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'auto' });
        }
      };

      scrollToHash();
      setTimeout(scrollToHash, 100);
      setTimeout(scrollToHash, 500);
      setTimeout(scrollToHash, 1500);

      setTimeout(() => {
        history.replaceState(null, '', window.location.pathname);
      }, 1700);
    }
  }, []);

  return (
    <>
      <main className="bg-white">
        <div className="relative">

          {/* ══════════════════════════════════════════════════
              CHAPTER 1: HERO — First Impression (sticky paper)
              ══════════════════════════════════════════════════ */}
          <section
            ref={heroRef}
            id="hero"
            className="hero-grid-bg sticky top-0 h-screen flex flex-col justify-between relative overflow-hidden pb-36 md:pb-44 pt-6 px-6 md:px-12"
          >
            <div className="w-full max-w-6xl mx-auto flex flex-col h-full relative z-10">
              {/* Top bar — role label + section number */}
              <div className="w-full flex items-center justify-between pt-3">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="tracking-[0.3em] text-[#777] font-sans font-medium text-[10px] md:text-xs"
                >
                  {profile?.heroRole || 'UI UX DESIGNER & FRONT END DEVELOPER'}
                </motion.span>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-4 flex-1 justify-end"
                >
                  <div className="hidden md:flex items-center gap-0 mx-4 flex-1 max-w-sm justify-end">
                    <div className="w-px h-2.5 bg-[#444]" />
                    <div className="h-px bg-[#ccc] flex-1 max-w-[120px]" />
                    <div className="w-px h-2.5 bg-[#444]" />
                  </div>
                  <span className="font-serif text-xl md:text-2xl font-normal text-[#111] tracking-wide">01</span>
                </motion.div>
              </div>

              {/* Main hero layout: Robot left + Headline right, Subtitle below, Pills left-aligned */}
              <div className="w-full flex flex-col items-center justify-center my-auto relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 w-full">
                  {/* Robot 3D — uncropped with balanced dimensions */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ opacity: heroOpacity }}
                    className="relative flex-shrink-0 w-[200px] md:w-[270px] lg:w-[320px] h-[200px] md:h-[270px] lg:h-[320px] my-0 overflow-visible"
                  >
                    <SplineScene
                      scene="https://prod.spline.design/bTBmc2h7TBzR3GJr/scene.splinecode"
                      className="w-full h-full"
                    />
                  </motion.div>

                  {/* Headline — rata kanan (right aligned) exactly as in mockup */}
                  <motion.div
                    style={{ y: heroTitleY, opacity: heroOpacity }}
                    className="flex-1 min-w-0"
                  >
                    <motion.h1
                      data-cursor="Hi there! Nice to meet you :]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif text-6xl md:text-8xl lg:text-[6.5rem] xl:text-[7rem] leading-[0.85] text-[#111] text-center md:text-right tracking-tighter cursor-default w-full"
                    >
                      {profile?.heroTitle ? (
                        profile.heroTitle.toLowerCase().includes('dynamic') ? (
                          <>
                            {profile.heroTitle.split(/dynamic/i)[0].trim()}
                            <br />
                            Dynamic Code.
                          </>
                        ) : (
                          profile.heroTitle
                        )
                      ) : (
                        <>Explorative design.<br />Dynamic Code.</>
                      )}
                    </motion.h1>
                  </motion.div>
                </div>

                {/* Subtitle — left aligned full width under heading/robot row */}
                <motion.div
                  style={{ y: heroSubtitleY, opacity: heroOpacity }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full mt-6 md:mt-4 pl-0"
                >
                  <p className="text-sm md:text-base text-[#555] w-full text-center md:text-left leading-relaxed">
                    {profile?.heroSubtitle || 'Bridging visual aesthetics and frontend logic to build impactful digital products.'}
                  </p>
                </motion.div>

                {/* Stats Bar Pills — indented to align with mockup */}
                {[profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4].filter(Boolean).length > 0 && (
                  <motion.div
                    style={{ opacity: heroOpacity }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 md:mt-8 pb-2 w-full md:pl-[240px] lg:pl-[280px]"
                  >
                    {[profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4]
                      .filter(Boolean)
                      .map((item, i) => (
                        <div
                          key={i}
                          className="px-5 py-2 rounded-full border border-[#e0e0e0] bg-white/90 backdrop-blur-sm shadow-2xs text-[11px] font-mono tracking-wider text-[#555]"
                        >
                          {item}
                        </div>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              CHAPTER 2: ABOUT — Paper slides up over Hero
              ══════════════════════════════════════════════════ */}

          {/* Pixel Grid Decoration — its OWN white section, guaranteed visible,
              sitting directly after Hero (no negative-margin overlap so it can
              never get tucked behind the sticky hero or blend into the black
              section below it). */}
          <div className="relative z-20 bg-white">
            <PixelGridDecoration />
            {/* Rotating Scroll Badge — overlaps top pixel grid area, positioned top-right exactly as in mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-8 md:-top-12 right-8 md:right-20 lg:right-28 z-40 w-[160px] h-[160px] md:w-[190px] md:h-[190px] pointer-events-none"
            >
              <RotatingScrollBadge />
            </motion.div>
          </div>

          <div id="about" className="relative z-20 -mt-[1px]">

            {/* Solid Black Banner — ONLY contains the Who I Am card */}
            <section className="bg-[#0a0a0a] pt-12 pb-16 px-6 md:px-12 text-white">
              <div className="max-w-6xl mx-auto">
                {/* White card with bio */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-8%' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid grid-cols-1 md:grid-cols-10 gap-0 overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid #e8e8e8',
                  }}
                >
                  {/* Left: Text Content */}
                  <div className="md:col-span-6 p-8 md:p-12 space-y-6 text-[#111]">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: '-10%' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-2"
                    >
                      <span className="label text-[#888] font-mono text-[11px] tracking-[0.25em] uppercase">About</span>
                      <h2 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">
                        Who I Am.
                      </h2>
                    </motion.div>

                    <div className="space-y-4 max-w-xl">
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-sm italic text-[#111] border-l-2 border-[#111] pl-5 leading-relaxed font-sans"
                      >
                        &ldquo;{profile?.aboutQuote || 'Hi, I\'m Icha, but I also go by Annisa Angelica Nugraha.'}&rdquo;
                      </motion.p>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs md:text-[13px] text-[#666] leading-relaxed whitespace-pre-line font-sans"
                      >
                        {profile?.aboutBio1}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs md:text-[13px] text-[#666] leading-relaxed whitespace-pre-line font-sans"
                      >
                        {profile?.aboutBio2}
                      </motion.p>
                    </div>
                  </div>

                  {/* Right: Portrait photo — fills column, B&W */}
                  <div ref={portraitRef} className="md:col-span-4 relative min-h-[300px] md:min-h-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isPortraitInView ? 1 : 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      data-cursor="It's me ♡"
                      className="absolute inset-0 overflow-hidden group"
                    >
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: isPortraitInView ? '101%' : 0 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        style={{ willChange: 'transform' }}
                        className="absolute inset-0 bg-[#0a0a0a] z-10"
                      />
                      <motion.div
                        initial={{ scale: 1.15 }}
                        animate={{ scale: isPortraitInView ? 1 : 1.15 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-1000"
                      >
                        <Image
                          src={profile?.aboutImage || 'https://placehold.co/600x800/1a1a1a/555555?text=Icha'}
                          alt="Portrait of Icha"
                          fill
                          sizes="(min-width: 768px) 380px, 100vw"
                          className="object-cover object-top"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </section>



            {/* Chronology Timeline — strictly on WHITE background (#ffffff) below the black box */}
            <section className="bg-white pt-16 pb-24 px-6 md:px-12 text-[#111]">
              <div className="max-w-6xl mx-auto">
                {experiences && experiences.length > 0 && (
                  <div className="space-y-0" data-cursor="What a journey... ✩">
                    <PageSectionHeader title="Chronology" number="02" />
                    <div className="flex flex-col mt-10">
                      {experiences.map((exp, i: number) => {
                        const isLast = i === experiences.length - 1;
                        return (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: '-5%' }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-start group py-4"
                          >
                            <div className="hidden md:block w-48 shrink-0 pt-1">
                              {exp.imageUrl ? (
                                <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out opacity-90 group-hover:opacity-100">
                                  <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                              ) : (
                                <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
                                  <span className="text-[9px] text-[#bbb] tracking-widest uppercase font-mono">N/A</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-center mr-6 md:mx-10 shrink-0 self-stretch">
                              <motion.div
                                whileInView={{ scale: [0, 1.3, 1] }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                                className="w-2.5 h-2.5 rounded-full bg-[#111] group-hover:bg-[#555] transition-colors duration-500 mt-[5px]"
                              />
                              <div className={`w-[1px] bg-[#e0e0e0] flex-1 mt-1 ${isLast ? 'opacity-0' : 'opacity-100'}`} />
                            </div>

                            <div className="flex-1 pt-0 pb-10 space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-xs md:text-[13px] tracking-[0.08em] text-[#111] font-bold">
                                  [{exp.year}]
                                </span>
                                <h4 className="font-mono text-xs md:text-[13px] tracking-tight text-[#111] font-bold">
                                  {exp.title}
                                </h4>
                              </div>
                              <p className="text-xs md:text-[13px] text-[#666] leading-relaxed font-sans pr-4 md:pr-12">
                                {exp.description}
                              </p>
                              <span className="text-[10px] tracking-[0.35em] text-[#888] font-mono italic block pt-1">
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

          {/* ══════════════════════════════════════════════════
              CHAPTER 3: WORK — The Craft
              ══════════════════════════════════════════════════ */}
          <div id="work">
            <WorkAndSkills projects={projects} />
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Work → Play
              ══════════════════════════════════════════════════ */}
          <div id="play">

            {/* ══════════════════════════════════════════════════
                CHAPTER 4: PLAY — Let's Have Fun
                ══════════════════════════════════════════════════ */}
            <section className="min-h-screen md:h-[100dvh] pt-6 pb-6 flex flex-col relative">
              <div className="px-6 md:px-12 flex-1 flex flex-col md:min-h-0">
                <PageSectionHeader title="LET'S TAKE A BREAK" number="04" />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col md:min-h-0 mt-4"
                >
                  <PlaySection />
                </motion.div>
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Play → Archives
              ══════════════════════════════════════════════════ */}
          <div id="archives">

            {/* ══════════════════════════════════════════════════
                CHAPTER 5: ARCHIVES — Recognition & Beyond Code
                ══════════════════════════════════════════════════ */}
            {certificates && certificates.length > 0 && (
              <section className="md:pt-6">
                <div className="px-6 md:px-12">
                  <PageSectionHeader title="Archives" number="05" />
                  <h3 className="text-3xl md:text-4xl font-serif text-[#111] mb-2">
                    Something meaningful.
                  </h3>
                  <p className="text-xs text-[#777] font-mono">
                    I've always believed that recognition is a testament to our efforts.
                  </p>
                  <div className="py-4 ">
                    <CertificateSection certificates={certificates} />
                  </div>
                </div>
              </section>
            )}

            {activities && activities.length > 0 && (
              <section className="mb-24 mt-4">
                <div className="px-6 md:px-12">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-serif text-[#111] mb-2">
                        Life outside the editor.
                      </h3>
                      <p className="text-xs text-[#777] font-mono">
                        Work, learn, repeat.
                      </p>
                    </div>
                  </div>
                  <div className="pt-0">
                    <ActivityGallery activities={activities} />
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Play → Contact
              ══════════════════════════════════════════════════ */}
          <div id="contact">

            {/* ══════════════════════════════════════════════════
                CHAPTER 6: CONTACT — Let's Talk
                ══════════════════════════════════════════════════ */}
            <section className="section-dark py-24 min-h-[60vh] flex flex-col justify-center relative bg-[#0a0a0a] text-white overflow-hidden">
              <div className="px-6 md:px-12 z-10">

                <div className="space-y-6 max-w-lg">
                  <motion.h2
                    initial={{ opacity: 0, scale: 1.1, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: false, margin: '-10%' }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-serif text-white leading-none uppercase tracking-tight"
                  >
                    YOU MADE IT.
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base text-gray-400 font-light"
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
                          } catch (err) {
                            window.open(urlStr, '_blank');
                          }
                        }}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#111] text-[10px] tracking-[0.4em] uppercase font-mono hover:bg-[#eee] transition-all duration-500 shadow-lg cursor-pointer font-bold"
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
                      <span className="text-[10px] text-[#666] tracking-[0.3em] uppercase italic">
                        Resume not available yet
                      </span>
                    )}
                  </motion.div>
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute -bottom-1/2 left-1/4 w-[600px] h-[600px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Rotating "Scroll to explore" circular badge ──────────────────────────────
function RotatingScrollBadge() {
  const text = 'Scroll to explore - Scroll to explore - ';

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 rounded-full border border-[#ccc] bg-white/95 backdrop-blur-sm shadow-md" />
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path
            id="circle-text-path"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text
          fontSize="7.4"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#111"
          letterSpacing="0.4"
          fontWeight="bold"
        >
          <textPath href="#circle-text-path">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[#111] text-lg font-bold"
        >
          ↓
        </motion.span>
      </div>
    </div>
  );
}

// ── Pixel Grid Decoration ──────────────────────────────
function PixelGridDecoration() {
  // Staircase/stepping pattern for mockup (diagonal effect from top-left extending right)
  const rows = [
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
  ];

  return (
    <div
      className="relative w-full bg-white overflow-hidden py-12 md:py-16"
      style={{ marginBottom: '-1px' }}
      aria-hidden="true"
    >
      <div className="flex justify-start w-full px-6 md:px-12">
        <div className="inline-flex flex-col gap-0">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-0">
              {row.map((filled, colIdx) => (
                <div
                  key={colIdx}
                  className={`w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex-shrink-0 transition-opacity duration-300 ${filled ? 'bg-[#0a0a0a] border border-[#1a1a1a]' : 'bg-transparent border border-transparent'
                    }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
