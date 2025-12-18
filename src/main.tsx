import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/styles/_keyframe-animations.scss'
import '@/styles/_variables.scss'
import App from './App.tsx'
import "@/assets/types/tanstack-table.d.ts";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
