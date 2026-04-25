import { useState } from 'react'
import { Link } from 'react-router-dom'

const heroImagePath = '/landing/hero-orchestra.jpg'

export default function HeroSection() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className='bg-superficies'>
      <div className='mx-auto grid min-h-[calc(100dvh-76px)] w-full max-w-[1400px] items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-5'>
        <div className='max-w-[600px] text-center lg:justify-self-start'>
          <h1 className='text-[40px] lg:text-[56px] font-bold leading-tight text-ink'>Nucleo Pirineos</h1>
          <p className='mt-4 text-[28px] leading-[1.34] text-[#3f4042]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget justo congue,
            placerat urna et, facilisis odio. Mauris dapibus odio otenti. Nunc blandit iaculis
            velit, id aliquam nisl cursus ac.
          </p>

          <div className='mt-7'>
            <Link
              className='inline-flex min-h-14 items-center justify-center rounded-[16px] bg-primary px-9 text-[20px] lg:text-[28px] font-semibold text-white shadow-[0px_4px_8px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-0.5 hover:bg-primaryHover'
              to='/events'
            >
              Ver calendario
            </Link>
          </div>
        </div>

        <div className='relative h-[420px] w-full overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0px_8px_18px_rgba(0,0,0,0.22)] md:h-[460px] lg:h-[520px]'>
          {imageFailed ? (
            <div className='relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_30%,#c4b79f_0%,#9e8f73_48%,#7f7158_100%)]'>
              <div className='rounded-xl bg-black/30 px-6 py-3 text-xl font-semibold text-white'>
                Imagen institucional
              </div>
            </div>
          ) : (
            <img
              alt='Orquesta juvenil en presentacion'
              className='h-full w-full object-cover'
              loading='eager'
              onError={() => setImageFailed(true)}
              src={heroImagePath}
            />
          )}
        </div>
      </div>
    </section>
  )
}
