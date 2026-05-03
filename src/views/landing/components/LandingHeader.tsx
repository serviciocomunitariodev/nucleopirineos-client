import { useState } from 'react'
import { BookUser, Boxes, CalendarRange, Eye, Menu, Undo2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { LandingHeaderVariant } from '@/views/landing/layout/LandingLayout'

const menuItems = [
  { label: 'Inicio', sectionId: 'hero' },
  { label: 'Mision y Vision', sectionId: 'mision-vision' },
  { label: 'Galeria', sectionId: 'galeria' },
  { label: 'Contacto', sectionId: 'contacto' },
  { label: 'Frases', sectionId: 'frases' },
]

type LandingHeaderProps = {
  variant?: LandingHeaderVariant
}

export default function LandingHeader({ variant = 'default' }: LandingHeaderProps) {
  const { isMobile } = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeSidebar = () => setIsSidebarOpen(false)
  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)

    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    closeSidebar()
  }

  if (variant === 'back-only') {
    return (
      <header className='sticky top-0 z-40 bg-primary'>
        <div className='mx-auto flex h-19 w-full items-center px-4 lg:px-5'>
          <Link
            className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/70 px-4 py-2 text-lg font-semibold text-white transition-colors hover:bg-white/10'
            to='/'
          >
            <Undo2 size={18} />
            Volver
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className='sticky top-0 z-40 bg-primary'>
      <div className='mx-auto flex h-19 w-full items-center gap-4 px-4 lg:px-5'>
        <div>
          <div className='h-9 w-28 rounded-xl bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.35)]' />
        </div>

        {isMobile ? (
          <button
            aria-label='Abrir menu'
            className='ml-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/70 text-white transition-colors hover:bg-white/10'
            onClick={() => setIsSidebarOpen(true)}
            type='button'
          >
            <Menu size={22} />
          </button>
        ) : null}

        <div className='ml-auto hidden items-center gap-8 md:flex'>
          <nav aria-label='Navegacion principal' className='hidden items-center gap-8 md:flex'>
            {menuItems.map((item) => (
              <button
                key={item.label}
                className='cursor-pointer text-xl font-semibold text-white transition-opacity hover:opacity-85'
                onClick={() => scrollToSection(item.sectionId)}
                type='button'
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Link
            className='cursor-pointer rounded-2xl bg-secondary px-6 py-3 text-xl font-semibold text-white shadow-[0px_4px_8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:brightness-95'
            to='/events'
          >
            Ver calendario
          </Link>

          <Link
            className='cursor-pointer rounded-2xl bg-white px-6 py-3 text-xl font-semibold text-ink shadow-[0px_3px_8px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5'
            to='/auth/login'
          >
            Iniciar sesion
          </Link>
        </div>
      </div>

      {isMobile ? (
        <div
          className={[
            'fixed inset-0 z-50 transition-opacity duration-200',
            isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        >
          <button
            aria-label='Cerrar menu'
            className='absolute inset-0 bg-black/35'
            onClick={closeSidebar}
            type='button'
          />

          <aside
            className={[
              'relative ml-auto flex h-dvh w-[82%] max-w-[320px] flex-col bg-primary px-5 py-5 text-white shadow-[-8px_0_18px_rgba(0,0,0,0.22)] transition-transform duration-200 ease-out',
              isSidebarOpen ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
          >
            <div className='mb-6 flex items-center justify-between'>
              <span className='text-lg font-semibold'>Menu</span>
              <button
                aria-label='Cerrar panel lateral'
                className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/70 hover:bg-white/10'
                onClick={closeSidebar}
                type='button'
              >
                <X size={20} />
              </button>
            </div>

            <nav aria-label='Menu de secciones landing' className='flex flex-col gap-3 text-lg font-semibold'>
              <Link
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={closeSidebar}
                to='/auth/login'
              >
                <Boxes size={25} />
                Iniciar Sesion
              </Link>
              <Link
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={closeSidebar}
                to='/events'
              >
                <CalendarRange size={25} />
                Ver Calendario
              </Link>
              <button
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={() => scrollToSection('mision-vision')}
                type='button'
              >
                <Eye size={25} />
                Mision y Vision
              </button>
              <button
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={() => scrollToSection('galeria')}
                type='button'
              >
                <Boxes size={25} />
                Galeria
              </button>
              <button
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={() => scrollToSection('contacto')}
                type='button'
              >
                <BookUser size={25} />
                Contacto
              </button>
              <button
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={() => scrollToSection('frases')}
                type='button'
              >
                <Eye size={25} />
                Frases
              </button>
              <Link
                className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-primaryHover'
                onClick={closeSidebar}
                to='/'
              >
                <Undo2 size={25} />
                Volver
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  )
}
