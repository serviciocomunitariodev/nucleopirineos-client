import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AcademicLevelForm from '@/views/administration/academicLevels/components/AcademicLevelForm'
import useCreateAcademicLevelMutation from '@/hooks/useCreateAcademicLevelMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NewAcademicLevel() {
  usePageTitle('Nuevo nivel academico')

  const navigate = useNavigate()
  const createAcademicLevelMutation = useCreateAcademicLevelMutation()

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nuevo nivel academico</Typography>
        <Typography color='text.secondary' variant='body2'>
          Completa la informacion para crear un nuevo nivel academico.
        </Typography>
      </div>

      <AcademicLevelForm
        mode='creation'
        isSubmitting={createAcademicLevelMutation.isPending}
        onCancel={() => navigate('/academic-levels')}
        onSubmit={async (values) => {
          try {
            await createAcademicLevelMutation.mutateAsync(values)
            toast.success('Nivel academico creado correctamente.')
            navigate('/academic-levels')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'No se pudo crear el nivel academico.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
