import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SubjectForm from '@/views/administration/subjects/components/SubjectForm'
import useSubjectQuery from '@/hooks/useSubjectQuery'
import useUpdateSubjectMutation from '@/hooks/useUpdateSubjectMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function EditSubject() {
  usePageTitle('Editar catedra')

  const navigate = useNavigate()
  const { id } = useParams()
  const subjectId = Number(id)
  const hasValidId = Number.isFinite(subjectId) && subjectId > 0

  const subjectQuery = useSubjectQuery(hasValidId ? subjectId : null)
  const updateSubjectMutation = useUpdateSubjectMutation()

  if (!hasValidId) {
    return <Typography color='error'>Identificador de catedra invalido.</Typography>
  }

  if (subjectQuery.isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <CircularProgress />
      </div>
    )
  }

  if (subjectQuery.isError || !subjectQuery.data) {
    return <Typography color='error'>No se pudo cargar la catedra.</Typography>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar catedra</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica la informacion de la catedra.
        </Typography>
      </div>

      <SubjectForm
        mode='edit'
        initialValues={{
          name: subjectQuery.data.name,
          type: subjectQuery.data.type,
        }}
        isSubmitting={updateSubjectMutation.isPending}
        onCancel={() => navigate('/subjects')}
        onSubmit={async (values) => {
          try {
            await updateSubjectMutation.mutateAsync({
              id: subjectId,
              payload: values,
            })
            toast.success('Catedra actualizada correctamente.')
            navigate('/subjects')
          } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo actualizar la catedra.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
