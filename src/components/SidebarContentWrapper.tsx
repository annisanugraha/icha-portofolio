'use client'

import { useSidebar } from '@/contexts/SidebarContext'

export function SidebarContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, sidebarWidth } = useSidebar()

  return (
    <div className="transition-all duration-300" style={isOpen ? { marginRight: sidebarWidth } : undefined}>
      {children}
    </div>
  )
}