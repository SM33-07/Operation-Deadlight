'use client'

import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ScrollProvider({ children }: Props) {
  useSmoothScroll()
  return <>{children}</>
}
