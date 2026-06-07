import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PersonRounded from '@mui/icons-material/PersonRounded'
import type { ProfessorRecord } from '@/types/users'

type ProfessorsShowcaseProps = {
  professors: ProfessorRecord[]
}

const selectItemClass = (isActive: boolean) =>
  [
    'relative transition-all duration-300 ease-out',
    isActive ? 'z-10 scale-100' : 'z-0 scale-90 hover:scale-95',
  ].join(' ')

const avatarClass = (isActive: boolean) =>
  [
    'flex items-center justify-center overflow-hidden rounded-full border-4 bg-[#e7e7df] text-white shadow-[0px_12px_24px_rgba(0,0,0,0.25)] transition-all duration-300',
    isActive
      ? 'h-32 w-32 border-white scale-100'
      : 'h-20 w-20 border-white/50 hover:border-white',
  ].join(' ')

const listItemClass = 'flex items-start gap-3 text-gray-700'

const formatProfessorName = (professor: ProfessorRecord) =>
  `${professor.user.firstName} ${professor.user.lastName}`

export default function ProfessorsShowcase({ professors }: ProfessorsShowcaseProps) {
  const [activeProfessor, setActiveProfessor] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeRecord = professors[activeProfessor]

  const nextProfessor = useCallback(() => {
    if (professors.length === 0) {
      return
    }

    setActiveProfessor((previous) => (previous + 1) % professors.length)
  }, [professors.length])

  useEffect(() => {
    if (activeProfessor >= professors.length) {
      setActiveProfessor(0)
    }
  }, [activeProfessor, professors.length])

  useEffect(() => {
    if (isPaused || professors.length <= 1) {
      return
    }

    const interval = window.setInterval(nextProfessor, 4000)

    return () => window.clearInterval(interval)
  }, [isPaused, nextProfessor, professors.length])

  const handleProfessorClick = (index: number) => {
    setActiveProfessor(index)
    setIsPaused(true)
  }

  if (!professors.length) {
    return (
      <section className=' py-16'>
        <div className='mx-auto flex min-h-130 w-full max-w-350 items-center justify-center px-4 lg:px-5'>
          <div className='max-w-2xl rounded-3xl border border-black/10 px-8 py-10 text-center text-ink shadow-[0px_10px_22px_rgba(0,0,0,0.12)]'>
            <h2 className='text-3xl font-bold md:text-4xl text-primary'>Profesores</h2>
            <p className='mt-4 text-base text-[#4a4b4f] md:text-lg'>
              No hay profesores publicados para mostrar en este momento.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16'>
      <div className='relative mx-auto w-full max-w-350 px-4 lg:px-5'>
        <div className='text-center text-ink'>
          <h2 className='text-3xl font-bold text-primary md:text-4xl'>Profesores</h2>
          <p className='mx-auto mt-4 max-w-3xl text-base text-[#4a4b4f] md:text-lg'>
            Conoce al equipo docente, sus niveles académicos y las cátedras que dictan.
          </p>
        </div>

        <div className='mt-10 md:hidden'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeRecord.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='rounded-3xl border border-black/10 bg-[#e7e7df] p-6 text-ink shadow-[0px_10px_22px_rgba(0,0,0,0.12)]'
            >
              <div className='flex flex-col items-center text-center'>
                  <div className='flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/20 bg-[#e7e7df] text-primary'>
                  <PersonRounded sx={{ color: 'primary.main', fontSize: 72 }} />
                </div>

                <div className='mt-5'>
                  <h3 className='text-2xl font-semibold text-ink'>{formatProfessorName(activeRecord)}</h3>
                  <p className='mt-1 text-sm text-[#4a4b4f]'>Profesor</p>
                </div>
              </div>

              <div className='mt-8 grid gap-6'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
                    Cátedras
                  </p>
                  <ul className='mt-4 space-y-3 pl-5'>
                    {activeRecord.subjects.length > 0 ? (
                      activeRecord.subjects.map((subject) => (
                        <li key={subject.id} className={listItemClass}>
                          <span className='mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary' />
                          <span>{subject.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className='text-[#4a4b4f]'>Sin asignar</li>
                    )}
                  </ul>
                </div>

                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
                    Niveles académicos
                  </p>
                  <ul className='mt-4 space-y-3 pl-5'>
                    {activeRecord.academicLevels.length > 0 ? (
                      activeRecord.academicLevels.map((level) => (
                        <li key={level.id} className={listItemClass}>
                          <span className='mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary' />
                          <span>{level.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className='text-[#4a4b4f]'>Sin asignar</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className='mt-4 flex justify-center gap-2'>
            {professors.map((professor, index) => (
              <button
                key={professor.id}
                aria-label={`Ver profesor ${formatProfessorName(professor)}`}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === activeProfessor ? 'bg-primary' : 'bg-primary/35'
                }`}
                onClick={() => handleProfessorClick(index)}
                type='button'
              />
            ))}
          </div>
        </div>

        <div className='hidden md:block'>
          <div className='relative mt-12 flex justify-center'>
            <div className='absolute top-1/2 h-1 w-full max-w-5xl -translate-y-1/2 bg-primary/40' />

            <div className='relative flex w-full max-w-6xl items-start justify-between gap-4'>
              {professors.map((professor, index) => {
                const isActive = index === activeProfessor

                return (
                  <button
                    key={professor.id}
                    aria-label={`Ver profesor ${formatProfessorName(professor)}`}
                    className={selectItemClass(isActive)}
                    onClick={() => handleProfessorClick(index)}
                    type='button'
                  >
                    <div className={avatarClass(isActive)}>
                      <PersonRounded sx={{ color: 'primary.main', fontSize: isActive ? 72 : 48 }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className='mt-10 flex min-h-70 items-center justify-center'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeRecord.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='grid w-full max-w-6xl items-center gap-8 rounded-3xl border border-black/10 bg-[#e7e7df] p-8 text-ink shadow-[0px_10px_22px_rgba(0,0,0,0.12)] xl:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)]'
              >
                <div className='xl:pr-6'>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
                    Cátedras
                  </p>
                  <ul className='mt-5 space-y-4'>
                    {activeRecord.subjects.length > 0 ? (
                      activeRecord.subjects.map((subject) => (
                        <li key={subject.id} className={listItemClass}>
                          <span className='mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary' />
                          <span>{subject.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className='text-[#4a4b4f]'>Sin asignar</li>
                    )}
                  </ul>
                </div>

                <div className='flex flex-col items-center text-center'>
                  <div className='flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary/20 bg-[#e7e7df] text-primary shadow-[0px_10px_22px_rgba(0,0,0,0.12)]'>
                    <PersonRounded sx={{ color: 'primary.main', fontSize: 92 }} />
                  </div>

                  <div className='mt-5'>
                    <h3 className='text-3xl font-semibold text-ink'>{formatProfessorName(activeRecord)}</h3>
                    <p className='mt-1 text-sm text-[#4a4b4f]'>Profesor</p>
                  </div>
                </div>

                <div className='xl:pl-6 xl:text-right'>
                  <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary'>
                    Niveles académicos
                  </p>
                  <ul className='mt-5 space-y-4 xl:ml-auto xl:max-w-90'>
                    {activeRecord.academicLevels.length > 0 ? (
                      activeRecord.academicLevels.map((level) => (
                        <li key={level.id} className='flex items-start gap-3 xl:justify-end'>
                          <span className='mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary xl:order-2' />
                          <span className='xl:order-1'>{level.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className='text-[#4a4b4f]'>Sin asignar</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}