import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useCreateEducationalMaterialMutation from '@/hooks/useCreateEducationalMaterialMutation'
import ResourceForm, { type ResourceFormSubmitValues } from './components/ResourceForm'

export default function NewResource() {
  const navigate = useNavigate()
  const createEducationalMaterialMutation = useCreateEducationalMaterialMutation()

  const handleSubmit = async (values: ResourceFormSubmitValues) => {
    try {
      await createEducationalMaterialMutation.mutateAsync(values)
      toast.success('Recurso creado correctamente.')
      navigate('/educational-materials')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el recurso.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nuevo Recurso</Typography>
        <Typography color='text.secondary' variant='body2'>
          Ingresa los detalles para crear un nuevo recurso educativo.
        </Typography>
      </div>

      <ResourceForm
        isSubmitting={createEducationalMaterialMutation.isPending}
        mode='creation'
        onCancel={() => navigate('/educational-materials')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
