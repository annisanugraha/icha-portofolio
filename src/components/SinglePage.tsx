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

/* ──────────────────────────────────────────────────
   STATS PARSING
   ────────────────────────────────────────────────── */
function buildStats(profile: Profile | null): string[] {
  return [profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4]
    .filter((s): s is string => Boolean(s));
}

/* ──────────────────────────────────────────────────
   HERO SECTION — Print Register Editorial Design
   ────────────────────────────────────────────────── */
function HeroSection({ profile }: { profile: Profile | null }) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ghostOutlineRef = useRef<HTMLDivElement>(null);
  const ghostSolidRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const splineWrapRef = useRef<HTMLDivElement>(null);
  const thinRef = useRef<HTMLSpanElement>(null);
  const boldRef = useRef<HTMLSpanElement>(null);

  const stats = buildStats(profile);

  // Ghost word: derive short name from profile
  const ghostWord = (profile?.logoText || 'ICHA').split(' ')[0].toUpperCase();

  // ── Canvas grid animation ──
  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cell = 46;
    const ink = '18,18,16';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function draw() {
      const r = hero!.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Grid statis — tidak ada animasi warna/wave, hanya garis grid halus.
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = `rgba(${ink},0.08)`;
      ctx!.lineWidth = 1;
      for (let x = 0; x <= w + cell; x += cell) {
        ctx!.beginPath(); ctx!.moveTo(x + 0.5, 0); ctx!.lineTo(x + 0.5, h); ctx!.stroke();
      }
      for (let y = 0; y <= h + cell; y += cell) {
        ctx!.beginPath(); ctx!.moveTo(0, y + 0.5); ctx!.lineTo(w, y + 0.5); ctx!.stroke();
      }
    }
    window.addEventListener('resize', draw);
    draw();

    return () => { window.removeEventListener('resize', draw); };
  }, []);

  // ── Magnetic letters + ghost drift + robot tilt ──
  useEffect(() => {
    const hero = heroRef.current;
    const ghostOutline = ghostOutlineRef.current;
    const ghostSolid = ghostSolidRef.current;
    const stage = stageRef.current;
    const splineWrap = splineWrapRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // Collect all magnetic letter spans
    let letterRects: Array<{ el: HTMLElement; cx: number; cy: number }> = [];
    function cacheLetter() {
      letterRects = [];
      [thinRef.current, boldRef.current].forEach(container => {
        if (!container) return;
        container.querySelectorAll<HTMLElement>('.hero-lt').forEach(span => {
          const r = span.getBoundingClientRect();
          letterRects.push({ el: span, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
        });
      });
    }
    window.addEventListener('load', cacheLetter);
    window.addEventListener('resize', cacheLetter);
    setTimeout(cacheLetter, 500);

    function onMouseMove(e: MouseEvent) {
      const mx = e.clientX, my = e.clientY;
      // Magnetic letters
      const radius = 130;
      letterRects.forEach(({ el, cx, cy }) => {
        const dx = mx - cx, dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          const strength = 1 - dist / radius;
          el.style.transform = `translate(${(-dx / dist) * strength * 6}px, ${(-dy / dist) * strength * 10}px)`;
        } else {
          el.style.transform = '';
        }
      });
      // Ghost drift
      const hr = hero.getBoundingClientRect();
      const nx = (mx - hr.left) / hr.width - 0.5;
      const ny = (my - hr.top) / hr.height - 0.5;
      if (ghostOutline) ghostOutline.style.transform = `translate(${nx * 14}px, ${ny * 10}px)`;
      if (ghostSolid) ghostSolid.style.transform = `translate(${-nx * 10}px, ${-ny * 7}px)`;
    }

    function onMouseLeave() {
      letterRects.forEach(({ el }) => el.style.transform = '');
      if (ghostOutline) ghostOutline.style.transform = '';
      if (ghostSolid) ghostSolid.style.transform = '';
      if (splineWrap) splineWrap.style.transform = '';
    }

    hero.addEventListener('mousemove', onMouseMove);
    hero.addEventListener('mouseleave', onMouseLeave);

    // Robot tilt on stage
    function onStageMouse(e: MouseEvent) {
      if (!stage || !splineWrap) return;
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      splineWrap.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    }
    function onStageLeave() {
      if (splineWrap) splineWrap.style.transform = '';
    }
    if (stage) {
      stage.addEventListener('mousemove', onStageMouse);
      stage.addEventListener('mouseleave', onStageLeave);
    }

    return () => {
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('load', cacheLetter);
      window.removeEventListener('resize', cacheLetter);
      if (stage) {
        stage.removeEventListener('mousemove', onStageMouse);
        stage.removeEventListener('mouseleave', onStageLeave);
      }
    };
  }, []);

  // ── Split headline into magnetic letter spans ──
  function splitToSpans(text: string) {
    return [...text].map((ch, i) => (
      <span key={i} className="hero-lt">{ch === ' ' ? '\u00A0' : ch}</span>
    ));
  }

  // Scroll cue
  function scrollToNext() {
    const hero = heroRef.current;
    if (!hero) return;
    const next = hero.nextElementSibling as HTMLElement | null;
    (next || document.body).scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section ref={heroRef} id="hero">
      {/* Animated grid canvas */}
      <canvas ref={canvasRef} className="hero-grid-canvas" aria-hidden="true" />

      {/* Print registration marks removed per user request */}

      {/* Ghost words — out-of-register print effect */}
      <div ref={ghostOutlineRef} className="ghost-outline" aria-hidden="true">{ghostWord}</div>
      <div ref={ghostSolidRef} className="ghost-solid" aria-hidden="true">{ghostWord}</div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-mid">
          {/* ── Left: Typography ── */}
          <div className="hero-mid-left">
            {/* CMS: profile.heroRole */}
            <motion.div
              className="hero-role"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mark">✦</span>
              {profile?.heroRole ?? 'UI/UX Designer & Frontend Developer'}
            </motion.div>

            {/* CMS: profile.heroTitle — split into magnetic letters */}
            <motion.h1
              className="hero-headline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span ref={thinRef} className="hero-h-thin">{splitToSpans(profile?.heroTitle ?? 'Explorative design.')}</span>
              <span ref={boldRef} className="hero-h-bold">{splitToSpans(profile?.heroTitleBold ?? 'Dynamic code.')}</span>
            </motion.h1>

            {/* CMS: profile.heroSubtitle */}
            <motion.div
              className="hero-sub"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bar" />
              <p>{profile?.heroSubtitle ?? 'Bridging visual aesthetics and frontend logic to build impactful digital products.'}</p>
            </motion.div>

            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid rgba(17,17,17,0.18)',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      flexShrink: 0,
                    }}
                  >
                    <b
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '12px',
                        color: '#111',
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                      }}
                    >
                      {s}
                    </b>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Right: Spline robot stage ── */}
          <motion.div
            ref={stageRef}
            className="hero-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Annotation callouts — editorial diagram flourish */}
            <div className="hero-annot a1" aria-hidden="true">
              <span className="chip">Optic array — dual sensor</span>
              <div className="leader" />
            </div>
            <div className="hero-annot a2" aria-hidden="true">
              <div className="leader" />
              <span className="chip">Shell — matte alloy</span>
            </div>
            <div className="hero-annot a3" aria-hidden="true">
              <span className="chip">Status — idle / standby</span>
              <div className="leader" />
            </div>

            {/* Spline robot + orbit ring */}
            <div
              ref={splineWrapRef}
              style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.25s ease-out' }}
            >
              {/* Orbit ring overlaid on top of Spline */}
              <div className="hero-orbit-ring" aria-hidden="true" />
              <SplineScene
                scene="https://prod.spline.design/bTBmc2h7TBzR3GJr/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-bottomrow">
            <span className="hero-avail">
              <i className="hero-avail-dot" />
              Available for projects
            </span>
            <button
              className="hero-scroll-btn"
              onClick={scrollToNext}
              aria-label="Scroll to explore"
            >
              <span>Scroll to explore</span>
              <svg className="hero-scroll-chevron" width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function SinglePage({ profile, projects, certificates, activities, experiences }: SinglePageProps) {
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
              CHAPTER 1: HERO — Print Register Editorial
              ══════════════════════════════════════════════════ */}
          <HeroSection profile={profile} />

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
                        &ldquo;{profile?.aboutQuote ?? 'Crafting digital clarity through intentional code.'}&rdquo;
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