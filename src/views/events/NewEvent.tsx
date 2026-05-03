import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useCreateEventMutation from '@/hooks/useCreateEventMutation'
import EventForm, { type EventFormSubmitValues } from '@/views/events/components/EventForm'

export default function NewEvent() {
  const navigate = useNavigate()
  const createEventMutation = useCreateEventMutation()

  const handleSubmit = async (values: EventFormSubmitValues) => {
    try {
      await createEventMutation.mutateAsync(values)
      toast.success('Evento creado correctamente.')
      navigate('/platform/events')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo crear el evento.'
      toast.error(message)
    }
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Nuevo Evento</Typography>
        <Typography color='text.secondary' variant='body2'>
          Ingresa los detalles para crear un nuevo evento.
        </Typography>
      </div>

      <EventForm
        isSubmitting={createEventMutation.isPending}
        mode='creation'
        onCancel={() => navigate('/platform/events')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
