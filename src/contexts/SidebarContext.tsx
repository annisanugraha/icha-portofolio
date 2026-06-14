'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isOpen: boolean
  sidebarWidth: number
  open: () => void
  close: () => void
  setSidebarWidth: (width: number) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(384)

  return (
    <SidebarContext.Provider value={{
      isOpen,
      sidebarWidth,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      setSidebarWidth,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return ctx
}