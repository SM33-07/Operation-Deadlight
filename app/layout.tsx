import type { Metadata } from 'next'
import { Cinzel, Lora, Geist_Mono } from 'next/font/google'
import { ScrollProvider } from '@/components/ScrollProvider'
import './globals.css'

const cinzel = Cinzel({ variable: '--font-cinzel', subsets: ['latin'] })
const lora = Lora({ variable: '--font-body', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const viewport = { width: 'device-width', initialScale: 1 }
export const metadata: Metadata = { 
  title: 'Case 07 - Operation Deadlight', 
  description: 'A story-driven cryptic hunt across nine fractured timelines.', 
  keywords: ['Aetherion', 'cryptic hunt', 'IEEE CS MUJ', 'puzzles'] 
}

export default function CaseFileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased m-0 p-0">
      <body className="min-h-full m-0 p-0 bg-black text-[#f4ece1] overflow-x-hidden">
        <div className={`${cinzel.variable} ${lora.variable} ${geistMono.variable} min-h-full bg-black relative overflow-x-hidden`}>
          <div className="aetherion-grain" />
          <div className="aetherion-scanlines" />
          <ScrollProvider>{children}</ScrollProvider>
        </div>
      </body>
    </html>
  )
}
