'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { askAI } from '@/actions/ai';
import { SuikaGame } from './SuikaGame';

export function PlaySection() {
  const [query, setQuery] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'help'>('game');
  const [gameScore, setGameScore] = useState(0);
  const [gameBest, setGameBest] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleScoreChange = useCallback((s: number, b: number) => {
    setGameScore(s);
    setGameBest(b);
  }, []);

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
  }, [messages, isLoading]);

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
      setMessages([...newMessages, { role: 'ai', content: `[ERROR] ${errorMsg}` }]);
    }
    setIsLoading(false);
  };

  const clearHistory = () => {
    setMessages([]);
    sessionStorage.removeItem('icha-ai-history');
  };

  return (
    <div className="w-full max-w-[1100px] bg-[#0a0a0a] border border-white/10 rounded-[10px] overflow-hidden flex flex-col h-[900px] md:h-[620px] font-mono text-white/85">
      {/* ── Header: macOS Window Style ── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0d0d0d] shrink-0">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full border border-white/20 bg-white/5"></span>
          <span className="w-3 h-3 rounded-full border border-white/20 bg-white/5"></span>
          <span className="w-3 h-3 rounded-full border border-white/20 bg-white/5"></span>
        </div>
        <span className="text-[11px] text-white/40 ml-2 tracking-widest uppercase">icha@portfolio:~/play</span>
      </div>

      {/* ── Body: Split Terminal ── */}
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 bg-white/5 flex-1 min-h-0">
        
        {/* Left Pane: Game / Help */}
        <div className="flex flex-col min-h-0 h-full border-b md:border-b-0 md:border-r border-white/10 bg-white/5">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#0d0d0d] shrink-0 overflow-x-auto h-[45px]">
            <div 
              onClick={() => setActiveTab('game')}
              className={`text-[12px] px-3 py-1 cursor-pointer whitespace-nowrap transition-colors rounded-md ${activeTab === 'game' ? 'text-white bg-[#2d2d2d]' : 'text-white/50 hover:text-white/80'}`}
            >
              GAME
            </div>
            <div 
              onClick={() => setActiveTab('help')}
              className={`text-[12px] px-3 py-1 cursor-pointer whitespace-nowrap transition-colors rounded-md flex items-center justify-center ${activeTab === 'help' ? 'text-white bg-[#2d2d2d]' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="hidden sm:inline">HOW TO PLAY</span>
              <span className="sm:hidden flex items-center justify-center w-[15px] h-[15px] rounded-full border border-current text-[10px] font-serif font-bold leading-none pb-[1px]">?</span>
            </div>
            <div className="flex-1"></div>
            <div className="text-[10px] text-white/50 tracking-widest font-mono uppercase whitespace-nowrap px-3">
              SCORE<strong className="text-white ml-1.5 text-xs">{gameScore}</strong>
            </div>
            <div className="text-[10px] text-white/50 tracking-widest font-mono uppercase whitespace-nowrap px-3 pr-4">
              BEST<strong className="text-white ml-1.5 text-xs">{gameBest}</strong>
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            <div className={activeTab === 'game' ? "w-full h-full flex flex-col" : "hidden"}>
              <SuikaGame onScoreChange={handleScoreChange} />
            </div>
            
            {activeTab === 'help' && (
              <div className="w-full max-h-full overflow-y-auto flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto py-8 px-6 scrollbar-none">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white font-serif text-base shadow-sm">
                    ?
                  </div>
                  <div className="text-lg font-bold tracking-tight text-white">How to Play</div>
                </div>
                <div className="text-left text-[11px] text-white/70 font-light space-y-3 leading-relaxed bg-white/5 border border-white/10 p-4 rounded-xl w-full">
                  <p className="flex gap-2.5 items-start">
                    <span className="font-mono text-[#0e0e0e] font-bold bg-white/90 px-1.5 py-0.5 rounded text-[9px] shrink-0 mt-0.5">1</span>
                    <span><strong className="text-white font-semibold">Aim & Drop:</strong> Move your cursor inside the white container and click to drop shapes.</span>
                  </p>
                  <p className="flex gap-2.5 items-start">
                    <span className="font-mono text-[#0e0e0e] font-bold bg-white/90 px-1.5 py-0.5 rounded text-[9px] shrink-0 mt-0.5">2</span>
                    <span><strong className="text-white font-semibold">Merge & Grow:</strong> When identical symbols collide, they combine (<span className="font-mono text-white font-medium">◦ → ⋆ → ✧</span>).</span>
                  </p>
                  <p className="flex gap-2.5 items-start">
                    <span className="font-mono text-[#0e0e0e] font-bold bg-white/90 px-1.5 py-0.5 rounded text-[9px] shrink-0 mt-0.5">3</span>
                    <span><strong className="text-white font-semibold">High Score:</strong> Keep merging for points without overflowing the top limit!</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('game')}
                  className="w-full py-2 bg-white text-black font-bold text-[10px] tracking-[0.2em] uppercase font-mono hover:bg-gray-200 active:scale-95 transition-all rounded-full shadow-md cursor-pointer"
                >
                  Got it, Let&apos;s Play!
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: AI CLI */}
        <div className="flex flex-col min-h-0 h-full relative">
          <div className="flex items-center justify-between px-6 py-2 shrink-0 h-[45px]">
            <div className="text-[11px] text-white/85 m-0 font-mono tracking-wide"><b>$</b> ask_me_a_secret</div>
            {messages.length > 0 && (
              <button onClick={clearHistory} className="text-[9px] text-white/40 hover:text-white hover:bg-white/10 uppercase tracking-widest border border-white/10 px-2 py-1 rounded transition-colors cursor-pointer shrink-0">
                [ CLEAR ]
              </button>
            )}
          </div>
          
          <div className="px-6 pb-6 pt-0 flex-1 flex flex-col min-h-0 relative">
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto min-h-0 pr-2 vscode-scrollbar"
            onWheel={(e) => {
              const el = chatRef.current;
              if (!el) return;
              const { scrollTop, scrollHeight, clientHeight } = el;
              if (scrollHeight <= clientHeight) return; 
              const atTop = scrollTop <= 1;
              const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;
              if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
                e.stopPropagation();
              }
            }}
          >
            <div className="text-[11px] text-white/60 leading-[1.8] font-mono mb-4">
              &gt; Hi! I'm TheAI, Icha's digital companion.<br/>
              &gt; Feel free to ask about her work, skills,<br/>
              &gt; or projects.
            </div>

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] leading-[1.8] font-mono mb-4"
              >
                {msg.role === 'user' ? (
                  <div className="text-white/90">
                    <b className="text-white mr-2">$</b>{msg.content}
                  </div>
                ) : (
                  <div className="text-white/60 pl-4 border-l border-white/10 py-1 prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 text-[11px] font-mono">
                    <div className="text-white/40 mb-1 tracking-widest text-[9px] uppercase">Output:</div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ node, ...props }) => <p className="!mb-1 !mt-0 leading-relaxed font-mono text-white/60" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 !my-1" {...props} />,
                        li: ({ node, ...props }) => <li className="!my-0" {...props} />,
                        a: ({ node, ...props }) => <a className="text-white underline decoration-white/30 underline-offset-2" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-white/10 px-1 py-0.5 rounded-sm text-white/80" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-white/90" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-white/40 pl-4 border-l border-white/10 mb-4 py-1 font-mono"
              >
                &gt; Processing request... <span className="inline-block w-1.5 h-3 bg-white/40 ml-1 animate-[blink_1s_step-end_infinite]"></span>
              </motion.div>
            )}
          </div>

          <div 
            className="shrink-0 relative text-[11px] text-white/50 flex items-center pt-4 mt-4 border-t border-white/5 font-mono cursor-text min-h-[40px]"
          >
            <span className="text-white/85 mr-3 font-bold">$</span>
            
            <div className="flex items-center text-[11px] pointer-events-none overflow-hidden whitespace-nowrap">
              {query ? (
                <>
                  <span className="text-white/90 whitespace-pre">{query.slice(0, cursorPos)}</span>
                  <span className="inline-block w-[7px] h-[14px] bg-white mx-[1px] animate-[blink_1s_step-end_infinite]"></span>
                  <span className="text-white/90 whitespace-pre">{query.slice(cursorPos)}</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-[7px] h-[14px] bg-white/80 mr-1 animate-[blink_1s_step-end_infinite]"></span>
                  <span className="text-white/20 whitespace-pre">ask anything</span>
                </>
              )}
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursorPos(e.target.selectionStart || e.target.value.length);
              }}
              onSelect={(e) => setCursorPos((e.target as HTMLInputElement).selectionStart || 0)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
              spellCheck="false"
              autoComplete="off"
              title="Terminal input"
            />
          </div>
        </div>
      </div>
    </div>
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    `}} />
  </div>
);
}