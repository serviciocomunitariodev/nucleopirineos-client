import { useMemo, useState } from 'react'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'

const defaultImage = '/landing/hero-orchestra.jpg'

export default function ImagesSection() {
  const images = useMemo(() => [defaultImage, defaultImage, defaultImage], [])
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <section className='bg-superficies py-8 md:py-10 landing-section' id='galeria'>
      <div className='mx-auto grid w-full max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 lg:px-5'>
        <button
          aria-label='Imagen anterior'
          className='flex h-12 w-12 items-center justify-center rounded-full cursor-pointer text-primary transition-colors hover:bg-primary/10'
          onClick={previousImage}
          type='button'
        >
          <CircleArrowLeft size={45} strokeWidth={2.25} />
        </button>

        <div className='mx-auto h-[260px] w-full max-w-[890px] overflow-hidden rounded-[14px] bg-white shadow-[0px_8px_16px_rgba(0,0,0,0.12)] md:h-[360px] lg:h-[520px]'>
          <img
            alt='Galeria nucleo pirineos'
            className='h-full w-full object-cover'
            src={images[currentIndex]}
          />
        </div>

        <button
          aria-label='Siguiente imagen'
          className='flex h-12 w-12 items-center justify-center rounded-full cursor-pointer text-primary transition-colors hover:bg-primary/10'
          onClick={nextImage}
          type='button'
        >
          <CircleArrowRight size={45} strokeWidth={2.25} />
        </button>
      </div>
    </section>
  )
}
