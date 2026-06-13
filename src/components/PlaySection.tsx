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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:border border-[#ebebeb] md:rounded-sm overflow-hidden bg-white md:h-[80vh] md:max-h-[700px] md:min-h-[480px]">
      {/* ── Left: Game ── */}
      <div className="bg-[#fafafa] flex flex-col items-center justify-center p-4 md:p-8 min-h-[400px] md:min-h-0 h-full">
        <div className="w-full h-full max-h-[600px] flex items-center justify-center overflow-hidden transform scale-[0.85] sm:scale-95 lg:scale-100 origin-center -my-4 lg:my-0">
          <SuikaGame />
        </div>
      </div>

      {/* ── Right: AI Chat ── */}
      <div className="flex flex-col bg-white h-[65vh] md:h-full min-h-[400px] md:min-h-0">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between shrink-0">
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

        <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white">
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

        <div className="px-6 pb-6 pt-4 bg-white shrink-0">
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
          <p className="text-center text-[10px] text-gray-400 mt-4 font-mono tracking-wide">
            POWERED BY GEMINI 1.5 FLASH
          </p>
        </div>
      </div>
    </div>
  )
}
