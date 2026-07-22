'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
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

      // Try scrolling immediately, then retry as images and dynamic content (like Canvas) load
      scrollToHash();
      setTimeout(scrollToHash, 100);
      setTimeout(scrollToHash, 500);
      setTimeout(scrollToHash, 1500);

      // Phase D fix: Remove hash from URL after scroll completes.
      // Prevents force-scroll back to section on page refresh.
      setTimeout(() => {
        history.replaceState(null, '', window.location.pathname);
      }, 1700);
    }
  }, []);

  return (
    <>
      {/* ── Content ── */}
      <main className="min-h-screen bg-white">
        <div>
          {/* ══════════════════════════════════════════════════
              CHAPTER 1: HERO — First Impression
              ══════════════════════════════════════════════════ */}
          <section
            ref={heroRef}
            id="hero"
            className="hero-grid-bg min-h-screen flex items-center md:pt-0 pt-20 relative overflow-hidden"
            style={{ minHeight: '100svh' }}
          >
            {/* 2-column grid: text left, Spline right */}
            <div className="w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative z-10">

              {/* Left: Text */}
              <motion.div
                style={{ y: heroTitleY, opacity: heroOpacity }}
                className="lg:col-span-7 space-y-8 max-w-2xl z-10"
              >
                {/* Role label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="label">
                    {profile?.heroRole || 'Software Engineer'}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  data-cursor="Hi there! Nice to meet you :]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="leading-[1.0] whitespace-pre-line cursor-default"
                >
                  {profile?.heroTitle || 'Building things that matter.'}
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                  style={{ y: heroSubtitleY }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 pt-2"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-6 h-px bg-[#111] origin-left"
                  />
                  <p className="text-xs text-[#999] tracking-wide">
                    {profile?.heroSubtitle || 'Engineering & minimal design.'}
                  </p>
                </motion.div>

                {/* Stats Bar */}
                {[profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4].filter(Boolean).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap items-center gap-3 pt-4"
                  >
                    {[profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4]
                      .filter(Boolean)
                      .map((item, i) => (
                        <div
                          key={i}
                          className="px-4 py-1.5 rounded-full border border-[#ebebeb] bg-[#fafafa]/90 backdrop-blur-sm text-[11px] font-mono tracking-wider text-[#333] shadow-xs"
                        >
                          {item}
                        </div>
                      ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Right: Spline 3D white robot — desktop only (hidden on mobile) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ opacity: heroOpacity, height: '100svh' }}
                className="hidden md:flex lg:col-span-5 w-full relative overflow-visible items-center justify-center"
              >
                <SplineScene
                  scene="https://prod.spline.design/bTBmc2h7TBzR3GJr/scene.splinecode"
                  className="w-full h-full"
                />
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              style={{ opacity: heroOpacity }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
            >
              <span className="text-[8px] font-mono tracking-[0.5em] text-[#bbb] uppercase">
                Scroll to explore
              </span>
              <ChevronDown size={14} className="text-[#ccc] scroll-indicator" />
            </motion.div>
          </section>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Hero → About
              ══════════════════════════════════════════════════ */}
          <div id="about">

            {/* ══════════════════════════════════════════════════
                CHAPTER 2: ABOUT — Behind The Screen
                ══════════════════════════════════════════════════ */}
            <section
              className="min-h-screen flex flex-col justify-center py-24 md:pt-16"
            >
              <div className="px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-4 items-center w-full">
                  {/* Text Content — Staggered reveal */}
                  <div className="md:col-span-6 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: '-10%' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-2"
                    >
                      <span className="label">About</span>
                      <h2 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">
                        Who I Am.
                      </h2>
                    </motion.div>

                    <div className="space-y-4 max-w-xl">
                      {/* Quote with underline draw */}
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-sm italic text-[#111] border-l-2 border-[#111] pl-5 leading-relaxed"
                      >
                        &ldquo;{profile?.aboutQuote || 'Crafting digital clarity through intentional code.'}&rdquo;
                      </motion.p>

                      {/* Bio paragraphs — staggered */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs text-[#777] leading-relaxed whitespace-pre-line"
                      >
                        {profile?.aboutBio1}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs text-[#777] leading-relaxed whitespace-pre-line"
                      >
                        {profile?.aboutBio2}
                      </motion.p>
                    </div>
                  </div>

                  {/* Portrait - Mobile Only — Simple fade-in */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex md:hidden justify-center w-full"
                  >
                    <div className="img-container aspect-square w-full max-w-[320px] rounded-sm overflow-hidden relative">
                      <Image
                        src={profile?.aboutImage || 'https://placehold.co/600x600/f5f5f5/999999?text=—'}
                        alt="Portrait"
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Portrait - Desktop — Curtain reveal */}
                  <div ref={portraitRef} className="hidden md:flex md:col-span-4 justify-center md:justify-start">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isPortraitInView ? 1 : 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      data-cursor="It's me ♡"
                      className="relative aspect-square w-full max-w-[380px] rounded-sm overflow-hidden group"
                    >
                      {/* Curtain overlay */}
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: isPortraitInView ? '101%' : 0 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        style={{ willChange: 'transform' }}
                        className="absolute inset-0 bg-[#111] z-10"
                      />
                      <motion.div
                        initial={{ scale: 1.15 }}
                        animate={{ scale: isPortraitInView ? 1 : 1.15 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-1000"
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

                {/* Timeline — Enhanced with staggered reveals and pulsing dots */}
                {experiences && experiences.length > 0 && (
                  <div className="mt-16 space-y-0" data-cursor="What a journey... ✩">
                    <PageSectionHeader title="Chronology" number="02" />
                    <div className="flex flex-col">
                      {experiences.map((exp, i: number) => {
                        const isLast = i === experiences.length - 1;
                        return (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: '-5%' }}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-start group"
                          >
                            <div className="hidden md:block w-48 shrink-0 pt-1">
                              {exp.imageUrl ? (
                                <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out opacity-80 group-hover:opacity-100">
                                  <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                              ) : (
                                <div className="aspect-video w-full bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center">
                                  <span className="text-[6px] text-[#ddd] tracking-widest uppercase font-mono">N/A</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-center mr-6 md:mx-10 shrink-0 self-stretch">
                              <motion.div
                                whileInView={{ scale: [0, 1.3, 1] }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                                className="w-2 h-2 rounded-full bg-[#111] group-hover:bg-[#ddd] transition-colors duration-500 mt-[5px]"
                              />
                              <div className={`w-[0.5px] bg-[#ebebeb] flex-1 ${isLast ? 'opacity-0' : 'opacity-100'}`} />
                            </div>

                            <div className="flex-1 pt-0 pb-10 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-[#111] group-hover:opacity-70 transition-opacity duration-500 font-bold">
                                  [{exp.year}]
                                </span>
                                <h4 className="font-mono text-[11px] md:text-[12px] tracking-tight text-[#111] group-hover:opacity-70 transition-opacity duration-500">
                                  {exp.title}
                                </h4>
                              </div>
                              <p className="text-[11px] md:text-[12px] text-[#777] leading-relaxed font-sans line-clamp-3 md:line-clamp-none pr-4 md:pr-12">
                                {exp.description}
                              </p>
                              <span className="text-[8px] tracking-[0.4em] text-[#bbb] group-hover:text-[#999] transition-colors font-mono italic">
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
              TRANSITION: About → Work
              ══════════════════════════════════════════════════ */}
          <div id="work">

            {/* ══════════════════════════════════════════════════
                CHAPTER 3: WORK — The Craft (light polish only)
                ══════════════════════════════════════════════════ */}
            <WorkAndSkills projects={projects} />
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Work → Play
              ══════════════════════════════════════════════════ */}
          <div id="play">

            {/* ══════════════════════════════════════════════════
                CHAPTER 4: PLAY — Let's Have Fun
                ══════════════════════════════════════════════════ */}
            <section
              className="min-h-screen md:h-[100dvh] pt-6 pb-6 flex flex-col relative"
            >
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
                      {/* <span className="label block mb-1">Beyond Code</span> */}
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
                  {/* Scale-from-huge entrance */}
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

                  {/* CTA with pulse glow */}
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

                {/* Spotlight gradient */}
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

function PortraitWithCursor({ src, isInView }: { src: string; isInView: boolean }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative aspect-square w-full max-w-[380px] rounded-sm overflow-hidden group cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursor(c => ({ ...c, visible: false }))}
    >
      {/* Custom cursor label */}
      <motion.div
        className="pointer-events-none absolute z-30 select-none"
        animate={{
          x: cursor.x - 40,
          y: cursor.y - 18,
          opacity: cursor.visible ? 1 : 0,
          scale: cursor.visible ? 1 : 0.7,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
      >
        <span className="bg-white text-[#111] text-[10px] font-mono tracking-tight px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-[#ebebeb]">
          it&apos;s me ˙ᵕ˙
        </span>
      </motion.div>

      {/* Curtain overlay */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isInView ? '101%' : 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: 'transform' }}
        className="absolute inset-0 bg-[#111] z-10"
      />
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: isInView ? 1 : 1.15 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        className="w-full h-full relative grayscale group-hover:grayscale-0 transition-all duration-1000"
      >
        <Image
          src={src}
          alt="Portrait"
          fill
          sizes="(min-width: 768px) 380px, 100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
