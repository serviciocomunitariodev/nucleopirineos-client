import HeroSection from '@/views/landing/components/HeroSection'
import ImagesSection from '@/views/landing/components/ImagesSection'
import MVSection from '@/views/landing/components/MVSection'
import PhrasesSection from '@/views/landing/components/PhrasesSection'
import SocialMedia from '@/views/landing/components/SocialMedia'
import LandingLayout from '@/views/landing/layout/LandingLayout'

export default function LandingPage() {
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
