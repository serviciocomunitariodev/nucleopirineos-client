import { Alert, CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useEducationalMaterialQuery from '@/hooks/useEducationalMaterialQuery'
import useUpdateEducationalMaterialMutation from '@/hooks/useUpdateEducationalMaterialMutation'
import ResourceForm, { type ResourceFormSubmitValues } from './components/ResourceForm'

export default function EditResource() {
  const { id } = useParams()
  const navigate = useNavigate()
  const educationalMaterialId = Number(id)

  const educationalMaterialQuery = useEducationalMaterialQuery(educationalMaterialId)
  const updateEducationalMaterialMutation = useUpdateEducationalMaterialMutation()

  const handleSubmit = async (values: ResourceFormSubmitValues) => {
    try {
      await updateEducationalMaterialMutation.mutateAsync({
        id: educationalMaterialId,
        payload: values,
      })
      toast.success('Recurso actualizado correctamente.')
      navigate('/educational-materials')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el recurso.'
      toast.error(message)
    }
  }

  if (educationalMaterialQuery.isLoading) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <CircularProgress />
      </div>
    )
  }

  if (educationalMaterialQuery.isError || !educationalMaterialQuery.data) {
    return <Alert severity='error'>No se pudo cargar el recurso.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar Recurso</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica los detalles del recurso educativo.
        </Typography>
      </div>

      <ResourceForm
        initialValues={{
          title: educationalMaterialQuery.data.title,
          professorId: educationalMaterialQuery.data.professorId,
          subjectId: educationalMaterialQuery.data.subjectId,
          fileUrl: educationalMaterialQuery.data.fileUrl,
        }}
        isSubmitting={updateEducationalMaterialMutation.isPending}
        mode='edit'
        onCancel={() => navigate('/educational-materials')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
