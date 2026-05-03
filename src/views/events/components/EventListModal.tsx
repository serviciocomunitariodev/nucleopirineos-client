import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const selectedEvent = events.find((item) => item.id === selectedEventId) ?? null

  const selectedEventTitle = useMemo(() => selectedEvent?.title ?? '', [selectedEvent])

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
                sx={{
                  borderRadius: '10px',
                  '&.Mui-selected': {
                    backgroundColor: '#BBDF7C',
                    color: '#1f2937',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#A9D76A',
                  },
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={`Hora: ${to12Hour(event.time)}`}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: event.id === selectedEventId ? 700 : 500,
                        color: event.id === selectedEventId ? '#1f2937' : '#111827',
                      },
                    },
                    secondary: {
                      sx: {
                        color: event.id === selectedEventId ? '#1f2937' : '#4b5563',
                      },
                    },
                  }}
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
        <Button
          onClick={onClose}
          sx={{
            color: '#556B2F',
            '&:hover': {
              backgroundColor: 'rgba(85,107,47,0.1)',
            },
          }}
        >
          Cerrar
        </Button>

        {canManage && selectedEvent ? (
          <>
            <Button
              onClick={() => onEditEvent(selectedEvent.id)}
              sx={{
                backgroundColor: '#556B2F',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#78A034',
                },
              }}
              variant='contained'
            >
              Editar
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              sx={{
                backgroundColor: '#974F43',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#7E4137',
                },
              }}
              variant='contained'
            >
              Eliminar
            </Button>
          </>
        ) : null}
      </DialogActions>

      <Dialog onClose={() => setIsDeleteDialogOpen(false)} open={isDeleteDialogOpen}>
        <DialogTitle>Confirmar eliminacion</DialogTitle>
        <DialogContent>
          <Typography>
            Esta seguro de eliminar el evento "{selectedEventTitle}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            sx={{
              color: '#556B2F',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!selectedEvent) {
                setIsDeleteDialogOpen(false)
                return
              }

              onDeleteEvent(selectedEvent.id)
              setIsDeleteDialogOpen(false)
            }}
            sx={{
              backgroundColor: '#974F43',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#7E4137',
              },
            }}
            variant='contained'
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}
