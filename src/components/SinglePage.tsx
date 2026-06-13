'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Send, User, Loader2, RotateCcw, ChevronDown } from 'lucide-react';
import { askAI } from '@/actions/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { PageSectionHeader } from './PageSectionHeader';
import { CertificateGrid } from './CertificateGrid';
import { WorkAndSkills } from './WorkAndSkills';
import { PlaySection } from './PlaySection';

interface SinglePageProps {
  profile: any;
  projects: any[];
  certificates: any[];
  experiences: any[];
}

// ── Reusable Section Transition Line ──
function SectionTransition() {
  return null;
}

// ── Chapter Label ──
function ChapterLabel({ number, title }: { number: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mb-8"
    >
      <span className="chapter-label">CH.{number}</span>
      <div className="w-8 h-px bg-[#ddd]" />
      <span className="chapter-label">{title}</span>
    </motion.div>
  );
}

export function SinglePage({ profile, projects, certificates, experiences }: SinglePageProps) {
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
            className="min-h-screen flex flex-col justify-center md:pt-0 pt-16 relative overflow-hidden"
          >
            <div className="px-6 md:px-12">

              <motion.div style={{ y: heroTitleY, opacity: heroOpacity }} className="space-y-8 max-w-2xl">
                {/* Role label with line draw */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="label">
                    {profile?.heroRole || 'Software Engineer'}
                  </span>
                </motion.div>

                {/* Title with staggered word reveal */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="leading-[1.0] whitespace-pre-line"
                >
                  {profile?.heroTitle || 'Building things that matter.'}
                </motion.h1>

                {/* Subtitle with delayed entrance */}
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
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              style={{ opacity: heroOpacity }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
            <SectionTransition />

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
                        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs text-[#777] leading-relaxed whitespace-pre-line"
                      >
                        {profile?.aboutBio1}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: false, margin: '-5%' }}
                        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs text-[#777] leading-relaxed whitespace-pre-line"
                      >
                        {profile?.aboutBio2}
                      </motion.p>
                    </div>
                  </div>

                  {/* Portrait - Desktop — Curtain reveal */}
                  <div ref={portraitRef} className="hidden md:flex md:col-span-4 justify-center md:justify-start">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isPortraitInView ? 1 : 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
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
                      <motion.img
                        initial={{ scale: 1.15 }}
                        animate={{ scale: isPortraitInView ? 1 : 1.15 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        src={profile?.aboutImage || 'https://placehold.co/600x600/f5f5f5/999999?text=—'}
                        alt="Portrait"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Timeline — Enhanced with staggered reveals and pulsing dots */}
                {experiences && experiences.length > 0 && (
                  <div className="mt-16 space-y-0">
                    <PageSectionHeader title="Chronology" number="02" />
                    <div className="flex flex-col">
                      {experiences.map((exp: any, i: number) => {
                        const isLast = i === experiences.length - 1;
                        return (
                          <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
                            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            viewport={{ once: false, margin: '-5%' }}
                            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
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
                                transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
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
            <SectionTransition />

            {/* ══════════════════════════════════════════════════
                CHAPTER 3: WORK — The Craft (light polish only)
                ══════════════════════════════════════════════════ */}
            <WorkAndSkills projects={projects} />
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Work → Archives
              ══════════════════════════════════════════════════ */}
          <div id="archives">
            <SectionTransition />

            {/* ══════════════════════════════════════════════════
                CHAPTER 4: ARCHIVES — The Evidence
                ══════════════════════════════════════════════════ */}
            {certificates && certificates.length > 0 && (
              <section className="py-24 md:pt-6">
                <div className="px-6 md:px-12">
                  <PageSectionHeader title="Archives" number="04" />
                  <div className="pt-6">
                    <CertificateGrid certificates={certificates} />
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Archives → Play
              ══════════════════════════════════════════════════ */}
          <div id="play">
            <SectionTransition />

            {/* ══════════════════════════════════════════════════
                CHAPTER 5: PLAY — Let's Have Fun
                ══════════════════════════════════════════════════ */}
            <section
              className="h-[100dvh] pt-6 pb-6 flex flex-col relative"
            >
              <div className="px-6 md:px-12 flex-1 flex flex-col min-h-0">
                <PageSectionHeader title="LET'S TAKE A BREAK" number="05" />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-5%' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col min-h-0 mt-4"
                >
                  <PlaySection />
                </motion.div>
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Play → Contact
              ══════════════════════════════════════════════════ */}
          <div id="contact">
            <SectionTransition />

            {/* ══════════════════════════════════════════════════
                CHAPTER 6: CONTACT — Let's Talk
                ══════════════════════════════════════════════════ */}
            <section className="py-24 min-h-[60vh] flex flex-col justify-center relative">
              <div className="px-6 md:px-12">

                <div className="space-y-6 max-w-lg">
                  {/* Scale-from-huge entrance */}
                  <motion.h2
                    initial={{ opacity: 0, scale: 1.5, y: 30, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: false, margin: '-10%' }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-serif text-black leading-none uppercase tracking-tight"
                  >
                    YOU MADE IT.
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-5%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base text-gray-500 font-light"
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
                    {profile?.emailAddress && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.emailAddress}&su=${encodeURIComponent(profile.emailSubject || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase font-mono hover:bg-[#333] transition-all duration-500 pulse-glow"
                      >
                        <span>Say Hello</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          →
                        </motion.span>
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono tracking-[0.3em] text-[#999] hover:text-[#111] transition-colors duration-300 uppercase link-underline"
                      >
                        LinkedIn
                      </a>
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
                      background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
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


