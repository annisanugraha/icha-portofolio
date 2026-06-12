'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, Sparkles, Send, User, Loader2, RotateCcw } from 'lucide-react'
import { askAI } from '@/actions/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { SuikaGame } from './SuikaGame'

export const PlaySection = () => {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Load history from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('icha-ai-history')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse history', e)
      }
    }
  }, [])

  // Save history to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('icha-ai-history', JSON.stringify(messages))
    }
  }, [messages])

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!query.trim() || isLoading) return

    const userQuery = query
    setQuery('')

    const newMessages = [...messages, { role: 'user', content: userQuery }] as const
    setMessages([...newMessages])
    setIsLoading(true)

    const result = await askAI(userQuery, messages)

    if (result.success) {
      setMessages([...newMessages, { role: 'ai', content: result.answer || '' }])
    } else {
      setMessages([...newMessages, { role: 'ai', content: 'Sorry, I am having trouble connecting. Please try again later.' }])
    }

    setIsLoading(false)
  }

  const clearHistory = () => {
    if (confirm('Clear chat history?')) {
      setMessages([])
      sessionStorage.removeItem('icha-ai-history')
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[600px] md:h-[700px] bg-white border border-[#ebebeb] rounded-sm overflow-hidden">
      {/* ── Kolom Kiri: Mini Game / Omikuji (60%) ── */}
      <div className="flex-1 md:flex-[0.6] border-b md:border-b-0 md:border-r border-[#ebebeb] flex flex-col items-center justify-center p-4 md:p-8 bg-[#fafafa] relative min-h-[400px]">
        <div className="w-full h-full max-h-[600px] flex items-center justify-center overflow-hidden">
          <SuikaGame />
        </div>
      </div>

      {/* ── Kolom Kanan: AI Assistant Area (40%) ── */}
      <div className="flex-1 md:flex-[0.4] flex flex-col bg-white overflow-hidden">
        {/* Header AI */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-black text-white rounded-xl">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-medium text-black text-sm tracking-tight">Icha&apos;s Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-medium">Online</p>
              </div>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all font-mono uppercase tracking-widest"
              title="Clear Chat History"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 min-h-0"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-4">
              <Bot size={32} className="text-gray-200" />
              <p className="text-xs text-gray-500 leading-relaxed font-light italic">
                &quot;Hi! I&apos;m Icha&apos;s Digital Assistant. Feel free to ask about my work, skills, or even my cats.&quot;
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-lg h-fit flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-50' : 'bg-black text-white'}`}>
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
                          table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-3 rounded-lg border border-gray-100 overflow-hidden bg-white">
                              <table className="min-w-full !m-0 text-[11px]" {...props} />
                            </div>
                          ),
                          th: ({node, ...props}) => <th className="px-3 py-2 bg-gray-50 text-left font-semibold text-gray-700" {...props} />,
                          td: ({node, ...props}) => <td className="px-3 py-2 border-t border-gray-50 text-gray-600" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-semibold text-black mt-4 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 mb-2" {...props} />,
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

        {/* Input Area */}
        <div className="px-8 pb-8 pt-4 bg-white shrink-0">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="w-full h-12 pl-6 pr-12 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-200 text-sm transition-all"
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
  )
}
