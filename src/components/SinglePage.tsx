'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bot, Sparkles, Send, User, Loader2, RotateCcw } from 'lucide-react';
import { askAI } from '@/actions/ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { PageSectionHeader } from './PageSectionHeader';
import { CertificateGrid } from './CertificateGrid';

interface SinglePageProps {
  profile: any;
  projects: any[];
  certificates: any[];
  experiences: any[];
}

export function SinglePage({ profile, projects, certificates, experiences }: SinglePageProps) {
  // Handle hash-based scroll on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['hero', 'about', 'work', 'play'].includes(hash)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const offset = 80;
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
        <div className="md:pl-16">
          {/* ── Hero ── */}
          <section
            id="hero"
            className="min-h-screen flex flex-col justify-center md:pt-0 pt-16"
          >
            <div className="-mt-16 md:mt-0 px-6 md:px-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="space-y-8 max-w-2xl"
              >
                <span className="label">
                  {profile?.heroRole || 'Software Engineer'}
                </span>
                <h1 className="leading-[1.0] whitespace-pre-line">
                  {profile?.heroTitle || 'Building things that matter.'}
                </h1>
                <div className="flex items-center gap-4 pt-2">
                  <div className="w-6 h-px bg-[#111]" />
                  <p className="text-xs text-[#999] tracking-wide">
                    {profile?.heroSubtitle || 'Engineering& minimal design.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── About ── */}
          <section
            id="about"
            className="min-h-screen flex flex-col justify-center py-24 pt-24 md:pt-16 border-t border-[#ebebeb]"
          >
            <div className="px-6 md:px-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-4 items-center w-full"
              >
                {/* Text Content */}
                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <span className="label">Persona</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#111] tracking-tight">
                      Who I Am.
                    </h2>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    <p className="text-sm italic text-[#111] border-l border-[#111] pl-5 leading-relaxed">
                      "{profile?.aboutQuote || 'Crafting digital clarity through intentional code.'}"
                    </p>
                    <p className="text-xs text-[#777] leading-relaxed whitespace-pre-line">
                      {profile?.aboutBio1}
                    </p>
                    <p className="text-xs text-[#777] leading-relaxed whitespace-pre-line">
                      {profile?.aboutBio2}
                    </p>
                  </div>
                </div>

                {/* Portrait - Desktop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.3 }}
                  className="hidden md:flex md:col-span-4 justify-center md:justify-start"
                >
                  <div className="img-container aspect-square w-full max-w-[380px] rounded-sm overflow-hidden">
                    <img
                      src={profile?.aboutImage || 'https://placehold.co/600x600/f5f5f5/999999?text=—'}
                      alt="Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Timeline */}
              {experiences && experiences.length > 0 && (
                <div className="mt-16 space-y-0">
                  <PageSectionHeader title="Chronology" number="02" />
                  <div className="flex flex-col">
                    {experiences.map((exp: any, i: number) => {
                      const isLast = i === experiences.length - 1;
                      return (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-5%' }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
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
                            <div className="w-2 h-2 rounded-full bg-[#111] group-hover:bg-[#ddd] transition-colors duration-500 mt-[5px]" />
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

          {/* ── Work ── */}
          <section
            id="work"
            className="py-24 pt-24 md:pt-16 border-t border-[#ebebeb]"
          >
            <div className="px-6 md:px-12">
              <PageSectionHeader title="Selected Work" number="03" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pt-6">
                {projects.map((project: any, i: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.9, delay: (i % 2) * 0.12 }}
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      className="group block space-y-4"
                    >
                      <div className="img-container aspect-[4/3] rounded-sm overflow-hidden">
                        <img
                          src={project.imageUrl || 'https://placehold.co/800x600/f5f5f5/999999?text=—'}
                          alt={project.title}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="label text-[#bbb]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="label text-[#bbb]">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-base font-serif group-hover:opacity-50 transition-opacity duration-500">
                          {project.title}
                        </h3>
                        <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2">
                          {project.shortDescription}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Archives (Certificates) ── */}
          {certificates && certificates.length > 0 && (
            <section
              id="archives"
              className="py-24 pt-24 md:pt-16 border-t border-[#ebebeb]"
            >
              <div className="px-6 md:px-12">
                <PageSectionHeader title="Archives" number="04" />
                <div className="pt-6">
                  <CertificateGrid certificates={certificates} />
                </div>
              </div>
            </section>
          )}

          {/* ── Play (AI Chat) ── */}
          <section
            id="play"
            className="py-24 pt-24 md:pt-16 border-t border-[#ebebeb]"
          >
            <div className="px-6 md:px-12">
              <PageSectionHeader title="Play" number="05" />
              <PlaySection />
            </div>
          </section>

          {/* ── Let's Talk ── */}
          <section className="py-24 border-t border-[#ebebeb]">
            <div className="px-6 md:px-12 space-y-4 max-w-lg">
              <h2 className="text-6xl md:text-8xl font-serif text-black leading-none">
                Let's talk.
              </h2>
              <p className="text-base text-gray-400 font-light italic">
                Available for new opportunities.
              </p>
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
      {/* ── Left: Omikuji Placeholder ── */}
      <div className="bg-[#fafafa] flex flex-col items-center justify-center p-12 min-h-[300px]">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-white border border-gray-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="text-gray-300" size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif text-black">Omikuji</h3>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em]">
              Fortune teller coming soon
            </p>
          </div>
          <button className="px-10 py-4 bg-black text-white text-[10px] tracking-[0.4em] uppercase font-mono hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
            Draw Fortune
          </button>
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
                Icha's Assistant
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
                "Hi! I'm Icha's Digital Assistant. Feel free to ask about my work, skills, or even my cats."
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-lg h-fit shrink-0 ${msg.role === 'user' ? 'bg-gray-50' : 'bg-black text-white'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'user'
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
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-gray-300" />
              </div>
            </div>
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
