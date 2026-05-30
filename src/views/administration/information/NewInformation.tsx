import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InformationForm from '@/views/administration/information/components/InformationForm'
import useCreateInformationMutation from '@/hooks/useCreateInformationMutation'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NewInformation() {
  usePageTitle('Nueva informacion')

  const navigate = useNavigate()
  const createInformationMutation = useCreateInformationMutation()

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nueva informacion</Typography>
        <Typography color='text.secondary' variant='body2'>
          Crea un nuevo bloque de informacion editable para la landing.
        </Typography>
      </div>

      <InformationForm
        mode='creation'
        isSubmitting={createInformationMutation.isPending}
        onCancel={() => navigate('/information')}
        onSubmit={async (values) => {
          try {
            await createInformationMutation.mutateAsync(values)
            toast.success('Informacion creada correctamente.')
            navigate('/information')
          } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo crear la informacion.'
            toast.error(message)
          }
        }}
      />
    </main>
  )
}
