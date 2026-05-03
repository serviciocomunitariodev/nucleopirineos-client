import { Alert, CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useEventQuery from '@/hooks/useEventQuery'
import useUpdateEventMutation from '@/hooks/useUpdateEventMutation'
import EventForm, { type EventFormSubmitValues } from '@/views/events/components/EventForm'

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const eventId = Number(id)

  const eventQuery = useEventQuery(eventId)
  const updateEventMutation = useUpdateEventMutation()

  const handleSubmit = async (values: EventFormSubmitValues) => {
    try {
      await updateEventMutation.mutateAsync({
        id: eventId,
        payload: values,
      })
      toast.success('Evento actualizado correctamente.')
      navigate('/platform/events')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el evento.'
      toast.error(message)
    }
  }

  if (eventQuery.isLoading) {
    return (
      <div className='flex h-50 items-center justify-center'>
        <CircularProgress />
      </div>
    )
  }

  if (eventQuery.isError || !eventQuery.data) {
    return <Alert severity='error'>No se pudo cargar el evento.</Alert>
  }

  return (
    <main className='space-y-6'>
      <div>
        <Typography variant='h5'>Editar Evento</Typography>
        <Typography color='text.secondary' variant='body2'>
          Modifica los detalles del evento.
        </Typography>
      </div>

      <EventForm
        initialValues={{
          title: eventQuery.data.title,
          description: eventQuery.data.description,
          startDate: toDateInputValue(eventQuery.data.startDate),
          endDate: toDateInputValue(eventQuery.data.endDate),
          location: eventQuery.data.location,
          time: eventQuery.data.time,
        }}
        isSubmitting={updateEventMutation.isPending}
        mode='edit'
        onCancel={() => navigate('/platform/events')}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
