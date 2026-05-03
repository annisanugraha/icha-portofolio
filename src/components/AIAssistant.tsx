'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, X, Bot, User, Loader2 } from 'lucide-react'
import { askAI } from '@/actions/ai'
import ReactMarkdown from 'react-markdown'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Load history from sessionStorage on mount
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

  // Save history to sessionStorage whenever it changes
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

    // Send history to backend
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
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Search size={20} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
          Ask AI Assistant
        </span>
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-black text-white rounded-lg">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Icha&apos;s AI Assistant</h3>
                    <p className="text-xs text-gray-500">Explore my journey and work through AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] text-gray-400 hover:text-red-500 transition-colors px-2"
                    >
                      Clear Chat
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Body */}
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
                    <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-lg h-fit ${msg.role === 'user' ? 'bg-gray-100' : 'bg-black text-white'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-gray-100 text-gray-800 rounded-tr-none' 
                        : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none'
                      }`}>
                        {msg.role === 'ai' ? (
                          <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0 prose-headings:text-black prose-strong:text-black">
                            <ReactMarkdown>
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

              {/* Input Area */}
              <div className="p-4 border-t bg-gray-50">
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 p-2 bg-black text-white rounded-lg disabled:bg-gray-300 transition-colors"
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
