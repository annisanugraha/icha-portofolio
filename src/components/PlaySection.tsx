'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Send, Loader2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { askAI } from '@/actions/ai';
import { SuikaGame } from './SuikaGame';

export function PlaySection() {
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
      const errorMsg = result.error || 'Sorry, I am having trouble connecting. Please try again later.';
      setMessages([...newMessages, { role: 'ai', content: `⚠️ ${errorMsg}` }]);
    }
    setIsLoading(false);
  };

  const clearHistory = () => {
    setMessages([]);
    sessionStorage.removeItem('icha-ai-history');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 border border-[#222] rounded-xl md:rounded-sm overflow-hidden bg-[#0d0d0d] text-white shadow-2xl md:h-full md:min-h-0">
      {/* ── Left: Game ── */}
      <div className="bg-[#121212] flex flex-col items-center justify-center p-4 md:p-8 min-h-[400px] md:min-h-0 md:h-full md:border-r border-[#222]">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <SuikaGame />
        </div>
      </div>

      {/* ── Right: AI Chat ── */}
      <div className="flex flex-col bg-[#0d0d0d] h-[500px] md:h-full md:min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#262626] flex items-center justify-between shrink-0 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-medium !text-white text-sm tracking-tight">
                Ask me a secret
              </h3>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-gray-300 hover:text-black bg-[#222] hover:bg-white border border-gray-600 rounded-lg transition-all font-mono uppercase tracking-widest cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div
          ref={chatRef}
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-[#0d0d0d] scrollbar-thin scrollbar-thumb-gray-700"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed font-light italic">
                &ldquo;Hi! I&apos;m TheAI, Icha&apos;s digital companion. Feel free to ask about her work, skills, or projects.&rdquo;
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
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${msg.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-[#222] border border-gray-600 text-base'
                  }`}>
                  {msg.role === 'user' ? <User size={15} /> : <span>☘</span>}
                </div>
                <div className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-lg ${msg.role === 'user'
                  ? 'bg-white text-black rounded-tr-none font-semibold border border-gray-200'
                  : 'bg-[#1f1f1f] border border-gray-600 text-gray-100 rounded-tl-none font-normal'
                  }`}>
                  {msg.role === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-invert overflow-x-auto text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3 rounded-lg border border-gray-700 overflow-hidden bg-[#121212]">
                              <table className="min-w-full !m-0 text-[11px]" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => <th className="px-3 py-2 bg-[#2a2a2a] text-left font-semibold text-white border-b border-gray-600" {...props} />,
                          td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-gray-700 text-gray-200" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-white mt-4 mb-2" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 text-gray-100 leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-gray-100" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-gray-100" {...props} />,
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
              <div className="bg-[#1f1f1f] border border-gray-600 p-3 rounded-2xl rounded-tl-none shadow-md flex items-center gap-2.5">
                <Loader2 size={16} className="animate-spin text-white" />
                <span className="text-xs text-gray-300 font-mono tracking-wider">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 bg-[#121212] border-t border-[#262626] shrink-0">
          <div className="relative flex items-center group z-10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="w-full h-12 pl-5 pr-14 rounded-xl bg-[#1a1a1a] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white text-base md:text-sm transition-all text-white placeholder-gray-400 font-medium relative z-10 shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !query.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-white hover:bg-gray-200 disabled:bg-[#2a2a2a] text-black disabled:text-gray-500 rounded-lg font-bold transition-all flex items-center justify-center shadow-md z-20 cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
