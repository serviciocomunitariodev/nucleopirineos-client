import type { ReactNode } from 'react'
import LandingHeader from '@/views/landing/components/LandingHeader'

export type LandingHeaderVariant = 'default' | 'back-only'

type LandingLayoutProps = {
  children: ReactNode
  headerVariant?: LandingHeaderVariant
}

export default function LandingLayout({ children, headerVariant = 'default' }: LandingLayoutProps) {
  return (
    <div className='min-h-dvh bg-[#e7e7df]'>
      <LandingHeader variant={headerVariant} />
      {children}
    </div>
  )
}
