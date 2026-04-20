import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AcademicLevelForm from '@/views/administration/academicLevels/components/AcademicLevelForm'
import useAcademicLevelQuery from '@/hooks/useAcademicLevelQuery'
import useUpdateAcademicLevelMutation from '@/hooks/useUpdateAcademicLevelMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditAcademicLevel() {
  usePageTitle('Editar nivel academico')

  const navigate = useNavigate()
  const { id } = useParams()
  const academicLevelId = Number(id)
  const hasValidId = Number.isFinite(academicLevelId) && academicLevelId > 0

  const academicLevelQuery = useAcademicLevelQuery(hasValidId ? academicLevelId : null)
  const updateAcademicLevelMutation = useUpdateAcademicLevelMutation()

  if (!hasValidId) {
    return <Typography color='error'>Identificador de nivel academico invalido.</Typography>
  }

  if (academicLevelQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (academicLevelQuery.isError || !academicLevelQuery.data) {
    return <Typography color='error'>No se pudo cargar el nivel academico.</Typography>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar nivel academico</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica la informacion del nivel academico.
        </Typography>
      </div>

      <AcademicLevelForm
        mode='edit'
        initialValues={{
          name: academicLevelQuery.data.name,
          minAge: academicLevelQuery.data.minAge,
          maxAge: academicLevelQuery.data.maxAge,
        }}
        isSubmitting={updateAcademicLevelMutation.isPending}
        onCancel={() => navigate('/academic-levels')}
        onSubmit={async (values) => {
          try {
            await updateAcademicLevelMutation.mutateAsync({
              id: academicLevelId,
              payload: values,
            })
            toast.success('Nivel academico actualizado correctamente.')
            navigate('/academic-levels')
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'No se pudo actualizar el nivel academico.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
