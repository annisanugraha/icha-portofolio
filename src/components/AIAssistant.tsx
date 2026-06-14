'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, X, Bot, User, Loader2 } from 'lucide-react'
import { askAI } from '@/actions/ai'
import { useSidebar } from '@/contexts/SidebarContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export default function AIAssistant() {
  const { isOpen, open, close, sidebarWidth, setSidebarWidth } = useSidebar()
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX
      setSidebarWidth(Math.max(280, Math.min(600, newWidth)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

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

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('icha-ai-history', JSON.stringify(messages))
    }
  }, [messages])

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
    <>
      <button
        onClick={open}
        className="fixed bottom-8 right-8 z-50 p-3 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Search size={20} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
          Ask AI Assistant
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ width: sidebarWidth, right: 0 }}
              className="fixed inset-y-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
            >
              {/* Drag handle */}
              <div
                onMouseDown={() => { setIsDragging(true); document.body.style.cursor = 'ew-resize'; document.body.style.userSelect = 'none'; }}
                className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-gray-300 transition-colors z-50 pointer-events-auto"
              />
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white rounded-lg">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-sm">Icha&apos;s AI Assistant</h3>
                    <p className="text-[10px] text-gray-400">Explore my journey and work through AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {messages.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Clear Chat
                    </button>
                  )}
                  <button onClick={close} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div
                ref={chatRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
              >
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm">
                      <Bot size={32} className="mx-auto mb-3 text-black" />
                      <p className="text-sm text-gray-800 font-medium mb-1">
                        Hi! I am Icha&apos;s Digital Assistant.
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Thank you so much for stopping by! I&apos;m here to help you navigate through Icha&apos;s work and experience. Is there anything specific you&apos;d like to know?
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => { setQuery("Tell me about Icha's projects"); }}
                        className="text-[10px] px-3 py-1 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                      >
                        Projects
                      </button>
                      <button
                        onClick={() => { setQuery("What is Icha's work experience?"); }}
                        className="text-[10px] px-3 py-1 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors"
                      >
                        Experience
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-lg h-fit ${msg.role === 'user' ? 'bg-gray-100' : 'bg-black text-white'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={`p-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gray-100 text-gray-800 rounded-tr-none'
                          : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none'
                      }`}>
                        {msg.role === 'ai' ? (
                          <div className="prose prose-sm max-w-none prose-slate overflow-x-auto">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                              components={{
                                table: ({node, ...props}) => (
                                  <div className="overflow-x-auto my-4 rounded-lg border border-gray-300 overflow-hidden bg-white">
                                    <table className="min-w-full !m-0 text-[12px] border-collapse" {...props} />
                                  </div>
                                ),
                                thead: ({node, ...props}) => (
                                  <thead className="bg-gray-50 border-b border-gray-300" {...props} />
                                ),
                                tbody: ({node, ...props}) => (
                                  <tbody className="divide-y divide-gray-200" {...props} />
                                ),
                                tr: ({node, ...props}) => (
                                  <tr className="divide-x divide-gray-200" {...props} />
                                ),
                                th: ({node, ...props}) => (
                                  <th className="px-3 py-2.5 font-semibold text-left text-gray-700" {...props} />
                                ),
                                td: ({node, ...props}) => (
                                  <td className="px-3 py-2.5 text-gray-600 align-top" {...props} />
                                ),
                                ol: ({node, ...props}) => (
                                  <ol className="list-decimal pl-8 space-y-1.5 my-2" {...props} />
                                ),
                                ul: ({node, ...props}) => (
                                  <ul className="list-disc pl-8 space-y-1.5 my-2" {...props} />
                                ),
                                li: ({node, ...props}) => (
                                  <li className="text-gray-700 leading-relaxed" {...props} />
                                ),
                                h3: ({node, ...props}) => <h3 className="text-sm font-semibold text-black mt-4 mb-2" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-[13px] font-semibold text-gray-800 mt-3 mb-1" {...props} />,
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
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl rounded-tl-none">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="w-full h-12 pl-4 pr-10 rounded-full bg-gray-50 border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}