import { Typography } from '@mui/material'
import type { Event } from '@/types/event'

type EventInfoProps = {
  event: Event
}

const toDisplayDate = (value: string) =>
  new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`))

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

export default function EventInfo({ event }: EventInfoProps) {
  const startDateLabel = toDisplayDate(event.startDate)
  const endDateLabel = event.endDate ? toDisplayDate(event.endDate) : null

  return (
    <section className='space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4'>
      <div>
        <Typography className='font-semibold text-primary' variant='h6'>
          {event.title}
        </Typography>
        <Typography color='text.secondary' variant='body2'>
          {event.description}
        </Typography>
      </div>

      <div className='space-y-1'>
        <Typography variant='body2'>
          <span className='font-semibold'>Fecha inicio:</span> {startDateLabel}
        </Typography>

        {endDateLabel ? (
          <Typography variant='body2'>
            <span className='font-semibold'>Fecha fin:</span> {endDateLabel}
          </Typography>
        ) : null}

        <Typography variant='body2'>
          <span className='font-semibold'>Hora:</span> {to12Hour(event.time)}
        </Typography>

        <Typography variant='body2'>
          <span className='font-semibold'>Ubicacion:</span> {event.location}
        </Typography>
      </div>
    </section>
  )
}
