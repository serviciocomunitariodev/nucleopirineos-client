import { useEffect, useState } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'
import HeroSection from '@/views/landing/components/HeroSection'
import ImagesSection from '@/views/landing/components/ImagesSection'
import MVSection from '@/views/landing/components/MVSection'
import PhrasesSection from '@/views/landing/components/PhrasesSection'
import SocialMedia from '@/views/landing/components/SocialMedia'
import LandingLayout from '@/views/landing/layout/LandingLayout'

const landingSections = [
  { id: 'hero', title: 'Inicio' },
  { id: 'mision-vision', title: 'Misión y Visión' },
  { id: 'galeria', title: 'Galería' },
  { id: 'contacto', title: 'Contacto' },
  { id: 'frases', title: 'Frases' },
]

export default function LandingPage() {
  const [activeSectionTitle, setActiveSectionTitle] = useState('Inicio')

  usePageTitle(`${activeSectionTitle}`)

  useEffect(() => {
    const sectionElements = landingSections
      .map((section) => ({
        title: section.title,
        element: document.getElementById(section.id),
      }))
      .filter((entry): entry is { title: string; element: HTMLElement } => Boolean(entry.element))

    if (!sectionElements.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!mostVisibleEntry) {
          return
        }

        const current = sectionElements.find((entry) => entry.element.id === mostVisibleEntry.target.id)

        if (current) {
          setActiveSectionTitle(current.title)
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -45% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    )

    sectionElements.forEach((entry) => observer.observe(entry.element))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <LandingLayout>
      <HeroSection />
      <MVSection />
      <ImagesSection />
      <SocialMedia />
      <PhrasesSection />
    </LandingLayout>
  )
}
