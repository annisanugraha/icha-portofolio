'use client'

import React from 'react'
import { PlaySection } from '@/components/PlaySection'

export default function PlayPage() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#0d0d0d] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto h-[calc(100vh-8rem)] min-h-[600px]">
        <PlaySection />
      </div>
    </div>
  )
}
