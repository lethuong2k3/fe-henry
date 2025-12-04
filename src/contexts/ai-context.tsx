'use client'

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type AiContextType = {
  aiToken: string | null
  setAiToken: (token: string) => void
}

const AiContext = createContext<AiContextType | undefined>(undefined)

export const AiProvider = ({ children }: { children: ReactNode }) => {
  const [aiToken, setAiToken] = useState<string | null>(
    import.meta.env.VITE_AI_TOKEN || null
  )
    
  return (
    <AiContext.Provider value={{ aiToken, setAiToken }}>
      {children}
    </AiContext.Provider>
  )
}

export const useAi = () => {
  const ctx = useContext(AiContext)
  if (!ctx) throw new Error('useAi must be used inside AiProvider')
  return ctx
}
