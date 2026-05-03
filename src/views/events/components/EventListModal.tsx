import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import type { Event } from '@/types/event'
import EventInfo from '@/views/events/components/EventInfo'

type EventListModalProps = {
  open: boolean
  events: Event[]
  selectedEventId: number | null
  onClose: () => void
  onSelectEvent: (id: number) => void
  onEditEvent: (id: number) => void
  onDeleteEvent: (id: number) => void
  canManage: boolean
}

const to12Hour = (value: string) => {
  const [hoursRaw, minutesRaw] = value.split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw ?? '0')

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value
  }

  const period = hours >= 12 ? 'pm' : 'am'
  const normalizedHour = hours % 12 === 0 ? 12 : hours % 12
  const normalizedMinutes = String(minutes).padStart(2, '0')

  return `${normalizedHour}:${normalizedMinutes}${period}`
}

export default function EventListModal({
  open,
  events,
  selectedEventId,
  onClose,
  onSelectEvent,
  onEditEvent,
  onDeleteEvent,
  canManage,
}: EventListModalProps) {
  const selectedEvent = events.find((item) => item.id === selectedEventId) ?? null

  return (
    <Dialog fullWidth maxWidth='md' onClose={onClose} open={open}>
      <DialogTitle>Eventos del dia</DialogTitle>

      <DialogContent>
        <div className='grid gap-4 md:grid-cols-[280px,1fr]'>
          <List className='max-h-105 overflow-y-auto rounded-xl border border-slate-200 p-1'>
            {events.map((event) => (
              <ListItemButton
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                selected={event.id === selectedEventId}
              >
                <ListItemText
                  primary={event.title}
                  secondary={`Hora: ${to12Hour(event.time)}`}
                />
              </ListItemButton>
            ))}
          </List>

          <div>
            {selectedEvent ? (
              <EventInfo event={selectedEvent} />
            ) : (
              <Typography color='text.secondary' variant='body2'>
                Selecciona un evento para ver su informacion.
              </Typography>
            )}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>

        {canManage && selectedEvent ? (
          <>
            <Button color='primary' onClick={() => onEditEvent(selectedEvent.id)} variant='contained'>
              Editar
            </Button>
            <Button color='error' onClick={() => onDeleteEvent(selectedEvent.id)} variant='contained'>
              Eliminar
            </Button>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
