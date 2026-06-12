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
import { SuikaGame } from './SuikaGame';

interface SinglePageProps {
  profile: any;
  projects: any[];
  certificates: any[];
  experiences: any[];
}

// ── Reusable Section Transition Line ──
function SectionTransition() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="h-px bg-gradient-to-r from-transparent via-[#111] to-transparent origin-center"
    />
  );
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
  const isPortraitInView = useInView(portraitRef, { once: false, margin: "-10%", amount: 0.5 });

  // Handle hash-based scroll on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['hero', 'about', 'work', 'archives', 'play', 'contact'].includes(hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const offset = window.innerWidth < 768 ? 48 : 0;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
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
              {/* Chapter label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="chapter-label block mb-6"
              >
                CH.01 — FIRST IMPRESSION
              </motion.span>

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
          <SectionTransition />

          {/* ══════════════════════════════════════════════════
              CHAPTER 2: ABOUT — Behind The Screen
              ══════════════════════════════════════════════════ */}
          <section
            id="about"
            className="min-h-screen flex flex-col justify-center py-24 md:pt-16"
          >
            <div className="px-6 md:px-12">
              <ChapterLabel number="02" title="BEHIND THE SCREEN" />

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
                    <span className="label">Persona</span>
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

          {/* ══════════════════════════════════════════════════
              TRANSITION: About → Work
              ══════════════════════════════════════════════════ */}
          <SectionTransition />

          {/* ══════════════════════════════════════════════════
              CHAPTER 3: WORK — The Craft (light polish only)
              ══════════════════════════════════════════════════ */}
          <section id="work">
            <WorkAndSkills projects={projects} />
          </section>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Work → Archives
              ══════════════════════════════════════════════════ */}
          <SectionTransition />

          {/* ══════════════════════════════════════════════════
              CHAPTER 4: ARCHIVES — The Evidence
              ══════════════════════════════════════════════════ */}
          {certificates && certificates.length > 0 && (
            <section id="archives" className="py-24 md:pt-16">
              <div className="px-6 md:px-12">
                <ChapterLabel number="04" title="THE EVIDENCE" />
                <PageSectionHeader title="Archives" number="04" />
                <div className="pt-6">
                  <CertificateGrid certificates={certificates} />
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════
              TRANSITION: Archives → Play
              ══════════════════════════════════════════════════ */}
          <SectionTransition />

          {/* ══════════════════════════════════════════════════
              CHAPTER 5: PLAY — Let's Have Fun
              ══════════════════════════════════════════════════ */}
          <section
            id="play"
            className="py-24 md:pt-16"
          >
            <div className="px-6 md:px-12">
              <ChapterLabel number="05" title="LET'S HAVE FUN" />
              <PageSectionHeader title="Play" number="05" />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-5%' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <PlaySection />
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              TRANSITION: Play → Contact
              ══════════════════════════════════════════════════ */}
          <SectionTransition />

          {/* ══════════════════════════════════════════════════
              CHAPTER 6: CONTACT — Let's Talk
              ══════════════════════════════════════════════════ */}
          <section id="contact" className="py-24 min-h-[60vh] flex flex-col justify-center relative">
            <div className="px-6 md:px-12">
              <ChapterLabel number="06" title="LET'S TALK" />

              <div className="space-y-6 max-w-lg">
                {/* Scale-from-huge entrance */}
                <motion.h2
                  initial={{ opacity: 0, scale: 1.5, y: 30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: false, margin: '-10%' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl md:text-8xl font-serif text-black leading-none"
                >
                  Let&apos;s talk.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-5%' }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base text-gray-400 font-light italic"
                >
                  Available for new opportunities.
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
      </main>
    </>
  );
}

// ── Play Section (inline AI chat) ──
function PlaySection() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('icha-ai-history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('icha-ai-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;
    const userQuery = query;
    setQuery('');
    const newMessages = [...messages, { role: 'user', content: userQuery }] as const;
    setMessages([...newMessages]);
    setIsLoading(true);
    const result = await askAI(userQuery, messages);
    if (result.success) {
      setMessages([...newMessages, { role: 'ai', content: result.answer || '' }]);
    } else {
      setMessages([...newMessages, { role: 'ai', content: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    }
    setIsLoading(false);
  };

  const clearHistory = () => {
    if (confirm('Clear chat history?')) {
      setMessages([]);
      sessionStorage.removeItem('icha-ai-history');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:border border-[#ebebeb] md:rounded-sm overflow-hidden">
      {/* ── Left: Game ── */}
      <div className="bg-[#fafafa] flex flex-col items-center justify-center p-4 md:p-8 min-h-[400px]">
        <div className="w-full h-full max-h-[600px] flex items-center justify-center overflow-hidden">
          <SuikaGame />
        </div>
      </div>

      {/* ── Right: AI Chat ── */}
      <div className="flex flex-col bg-white min-h-[400px] md:min-h-[500px]">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl">
              <Bot size={16} />
            </div>
            <div>
              <h3 className="font-medium text-black text-sm tracking-tight">
                Icha&apos;s Assistant
              </h3>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-mono uppercase tracking-widest"
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-4">
              <Bot size={32} className="text-gray-200" />
              <p className="text-xs text-gray-500 leading-relaxed font-light italic">
                &ldquo;Hi! I&apos;m Icha&apos;s Digital Assistant. Feel free to ask about my work, skills, or even my cats.&rdquo;
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-lg h-fit shrink-0 ${msg.role === 'user' ? 'bg-gray-50' : 'bg-black text-white'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                  ? 'bg-gray-50 text-gray-700 rounded-tr-none'
                  : 'bg-white border border-gray-100 text-gray-600 rounded-tl-none shadow-sm'
                  }`}>
                  {msg.role === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-slate overflow-x-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3 rounded-lg border border-gray-100 overflow-hidden bg-white">
                              <table className="min-w-full !m-0 text-[11px]" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => <th className="px-3 py-2 bg-gray-50 text-left font-semibold text-gray-700" {...props} />,
                          td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-gray-50 text-gray-600" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-black mt-4 mb-2" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-gray-300" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 bg-white">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="w-full h-12 pl-5 pr-12 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-200 text-sm transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !query.trim()}
              className="absolute right-3 p-2 text-gray-300 hover:text-black disabled:text-gray-200 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
