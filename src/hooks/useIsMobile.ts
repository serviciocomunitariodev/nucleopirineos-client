import { useEffect, useState } from 'react'

export const MOBILE_MAX_WIDTH = 450
export const TABLET_MAX_WIDTH = 850

export type UseIsMobileOptions = {
  mobileMaxWidth?: number
  tabletMaxWidth?: number
}

type DeviceType = 'mobile' | 'tablet' | 'desktop'

type BreakpointState = {
  width: number
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const getBreakpointState = (
  width: number,
  mobileMaxWidth: number,
  tabletMaxWidth: number,
): BreakpointState => {
  if (width <= mobileMaxWidth) {
    return {
      width,
      deviceType: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    }
  }

  if (width <= tabletMaxWidth) {
    return {
      width,
      deviceType: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    }
  }

  return {
    width,
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }
}

const getCurrentWidth = () =>
  typeof window !== 'undefined' ? window.innerWidth : TABLET_MAX_WIDTH + 1

export function useIsMobile(options: UseIsMobileOptions = {}) {
  const mobileMaxWidth = options.mobileMaxWidth ?? MOBILE_MAX_WIDTH
  const tabletMaxWidth = options.tabletMaxWidth ?? TABLET_MAX_WIDTH

  const [state, setState] = useState<BreakpointState>(() =>
    getBreakpointState(getCurrentWidth(), mobileMaxWidth, tabletMaxWidth),
  )

  useEffect(() => {
    const onResize = () =>
      setState(getBreakpointState(window.innerWidth, mobileMaxWidth, tabletMaxWidth))

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mobileMaxWidth, tabletMaxWidth])

  return state
}