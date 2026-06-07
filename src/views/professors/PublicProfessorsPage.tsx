import { Alert } from '@mui/material'
import { usePageTitle } from '@/hooks/usePageTitle'
import useProfessorsQuery from '@/hooks/useProfessorsQuery'
import LandingLayout from '@/views/landing/layout/LandingLayout'
import ProfessorsShowcase from './components/ProfessorsShowcase'

export default function PublicProfessorsPage() {
  usePageTitle('Profesores')

  const professorsQuery = useProfessorsQuery()

  return (
    <LandingLayout headerVariant='back-only'>
      <main className='w-full bg-superficies py-6'>
        <div className='mx-auto w-full max-w-350 px-4 lg:px-5'>
          {professorsQuery.isError ? (
            <Alert severity='error'>No se pudo cargar la información de los profesores.</Alert>
          ) : null}

          <ProfessorsShowcase professors={professorsQuery.data ?? []} />
        </div>
      </main>
    </LandingLayout>
  )
}