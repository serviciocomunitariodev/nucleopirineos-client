import { useEffect, useState } from 'react'
import { usePageTitle } from '@/hooks/usePageTitle'
import useInformationsQuery from '@/hooks/useInformationsQuery'
import { informationDefaults } from '@/types/information'
import useMultimediaQuery from '@/hooks/useMultimediaQuery'
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

  const heroQuery = useMultimediaQuery({ section: 'HERO' })
  const missionVisionQuery = useMultimediaQuery({ section: 'MISSION_VISION' })
  const galleryQuery = useMultimediaQuery({ section: 'GALLERY' })
  const informationQuery = useInformationsQuery()

  const heroImageUrl = heroQuery.data?.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]?.imageUrl
  const missionVisionItems = (missionVisionQuery.data ?? []).slice()
  const missionImageUrl = missionVisionItems.find((item) => item.sortOrder === 1)?.imageUrl
  const visionImageUrl = missionVisionItems.find((item) => item.sortOrder === 2)?.imageUrl
  const galleryImages = (galleryQuery.data ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 6)
    .map((item) => item.imageUrl)

  const informationItems = informationQuery.data ?? []

  const getInformationValue = (key: string, fallback: string) => {
    return informationItems.find((item) => item.key === key)?.value ?? fallback
  }

  const heroTitle = getInformationValue('hero_title', informationDefaults.heroTitle)
  const heroDescription = getInformationValue('hero_description', informationDefaults.heroDescription)
  const heroButtonText = getInformationValue('hero_button_text', informationDefaults.heroButtonText)
  const missionText = getInformationValue('mission_text', informationDefaults.missionText)
  const visionText = getInformationValue('vision_text', informationDefaults.visionText)

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
      <HeroSection
        imageUrl={heroImageUrl}
        title={heroTitle}
        description={heroDescription}
        buttonText={heroButtonText}
      />
      <MVSection
        missionImageUrl={missionImageUrl}
        visionImageUrl={visionImageUrl}
        missionText={missionText}
        visionText={visionText}
      />
      <ImagesSection images={galleryImages} />
      <SocialMedia />
      <PhrasesSection />
    </LandingLayout>
  )
}
