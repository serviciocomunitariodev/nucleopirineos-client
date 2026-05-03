import FullCalendar from '@fullcalendar/react'
import esLocale from '@fullcalendar/core/locales/es'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Alert, CircularProgress, Paper, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { BaseButton } from '@/components/BaseButton'
import useDeleteEventMutation from '@/hooks/useDeleteEventMutation'
import useEventsQuery from '@/hooks/useEventsQuery'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Event } from '@/types/event'
import EventListModal from '@/views/events/components/EventListModal'

type EventCalendarCoreProps = {
  title?: string
  canManage?: boolean
  visibility?: 'public' | 'platform'
  onCreateClick?: () => void
  onEditEvent?: (id: number) => void
}

const getDateKey = (value: string) => value.slice(0, 10)
const buildLocalDateTime = (date: string, time: string) => `${getDateKey(date)}T${time}:00`
const toUtcDate = (dateKey: string) => new Date(`${dateKey}T00:00:00Z`)
const toDateKey = (value: Date) => value.toISOString().slice(0, 10)
const toLocalDateKey = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
const toMobileEventsCountLabel = (count: number) => (count > 9 ? '+9' : String(count))

const closeFullCalendarPopovers = () => {
  if (typeof document === 'undefined') {
    return
  }

  const closeButton = document.querySelector<HTMLElement>('.fc-popover .fc-popover-close')

  if (closeButton) {
    closeButton.click()
    return
  }

  document.querySelectorAll('.fc-popover').forEach((popover) => {
    popover.remove()
  })
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

  if (minutes === 0) {
    return `${normalizedHour}${period}`
  }

  return `${normalizedHour}:${String(minutes).padStart(2, '0')}${period}`
}

export default function EventCalendarCore({
  title = 'Calendario de eventos',
  canManage = false,
  visibility = 'public',
  onCreateClick,
  onEditEvent,
}: EventCalendarCoreProps) {
  const { isMobile, isTablet } = useIsMobile()
  const eventsQuery = useEventsQuery({ visibility })
  const deleteEventMutation = useDeleteEventMutation()
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>()

    for (const event of eventsQuery.data ?? []) {
      const startDateKey = getDateKey(event.startDate)
      const endDateKey = event.endDate ? getDateKey(event.endDate) : startDateKey
      let cursor = toUtcDate(startDateKey)
      const endDate = toUtcDate(endDateKey)

      while (cursor <= endDate) {
        const key = toDateKey(cursor)
        const list = map.get(key) ?? []
        list.push(event)
        map.set(key, list)
        cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
      }
    }

    for (const [key, value] of map.entries()) {
      map.set(
        key,
        [...value].sort(
          (left, right) => left.time.localeCompare(right.time) || left.title.localeCompare(right.title),
        ),
      )
    }

    return map
  }, [eventsQuery.data])

  const selectedDayEvents = selectedDateKey ? eventsByDate.get(selectedDateKey) ?? [] : []

  const openModalForDate = (dateKey: string, eventId?: number) => {
    const dayEvents = eventsByDate.get(dateKey) ?? []

    if (dayEvents.length === 0) {
      return
    }

    setSelectedDateKey(dateKey)
    setSelectedEventId(eventId ?? dayEvents[0]?.id ?? null)
  }

  const calendarEvents = useMemo(
    () =>
      (eventsQuery.data ?? []).map((event) => ({
        id: String(event.id),
        title: event.title,
        start: buildLocalDateTime(event.startDate, event.time),
        end: event.endDate ? buildLocalDateTime(event.endDate, event.time) : undefined,
        allDay: false,
        extendedProps: {
          time: event.time,
        },
      })),
    [eventsQuery.data],
  )

  if (eventsQuery.isLoading) {
    return (
      <div className='flex h-50 items-center justify-center'>
        <CircularProgress />
      </div>
    )
  }

  if (eventsQuery.isError) {
    return <Alert severity='error'>No se pudo cargar el calendario de eventos.</Alert>
  }

  return (
    <Paper className='rounded-3xl border border-primary/10 bg-white shadow-[0px_10px_28px_rgba(0,0,0,0.12)]' sx={{ p: 3 }}>
      <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <Typography className='text-primary' gutterBottom sx={{ fontSize: { xs: '20px', md: '30px' }, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography color='text.secondary' sx={{ fontSize: { xs: '12px', md: '16px' } }}>
            Consulta los eventos programados del núcleo
          </Typography>
        </div>

        {canManage ? (
          <div className='w-full md:w-auto'>
            <BaseButton
              fullWidth
              onClick={onCreateClick}
              startIcon={<Plus size={18} />}
              sx={{
                minHeight: 44,
                px: 3,
                fontSize: '16px',
                backgroundColor: '#556B2F',
                '&:hover': { backgroundColor: '#78A034' },
              }}
              text='Nuevo evento'
              type='button'
            />
          </div>
        ) : null}
      </div>

      <div className='event-calendar-shell lg:h-[calc(100vh-300px)]'>
        <FullCalendar
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: isMobile ? 'Sem.' : 'Semana',
            day: 'Dia',
          }}
          dayHeaderFormat={isMobile ? { weekday: 'narrow' } : { weekday: 'short' }}
          dateClick={(info) => {
            openModalForDate(info.dateStr)
          }}
          dayMaxEvents={1}
          dayCellDidMount={(info) => {
            const eventsCount = eventsByDate.get(toLocalDateKey(info.date))?.length ?? 0
            const dayFrame = info.el.querySelector<HTMLElement>('.fc-daygrid-day-frame')

            if (!dayFrame) {
              return
            }

            if (!isMobile || eventsCount === 0) {
              dayFrame.classList.remove('fc-mobile-has-events')
              dayFrame.removeAttribute('data-event-count')
              return
            }

            dayFrame.classList.add('fc-mobile-has-events')
            dayFrame.setAttribute('data-event-count', toMobileEventsCountLabel(eventsCount))
          }}
          eventClick={(info) => {
            const eventId = Number(info.event.id)

            if (!Number.isFinite(eventId)) {
              return
            }

            openModalForDate(info.event.startStr.slice(0, 10), eventId)
          }}
          eventContent={(info) => {
            const rawTime = String(info.event.extendedProps.time ?? '')

            return (
              <div className='flex items-center gap-1 text-xs font-semibold text-white'>
                <span>{to12Hour(rawTime)}</span>
                <span>{info.event.title}</span>
              </div>
            )
          }}
          events={isMobile ? [] : calendarEvents}
          headerToolbar={{
            left: isMobile ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: isMobile ? 'today dayGridMonth' : 'dayGridMonth,timeGridWeek',
          }}
          height={isMobile || isTablet ? 'auto' : '100%'}
          initialView='dayGridMonth'
          locale='es'
          locales={[esLocale]}
          moreLinkClick={(argumentsData) => {
            argumentsData.jsEvent?.preventDefault()
            argumentsData.jsEvent?.stopPropagation()

            const dateKey =
              argumentsData.date instanceof Date
                ? argumentsData.date.toISOString().slice(0, 10)
                : String(argumentsData.date).slice(0, 10)

            if (dateKey.length === 10) {
              openModalForDate(dateKey)
              window.requestAnimationFrame(() => {
                closeFullCalendarPopovers()
                window.requestAnimationFrame(() => {
                  closeFullCalendarPopovers()
                })
              })
            }
          }}
          moreLinkContent={(argumentsData) =>
            `+${argumentsData.num} evento${argumentsData.num === 1 ? '' : 's'} mas...`
          }
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          titleFormat={isMobile ? { month: 'long', year: 'numeric' } : undefined}
          slotLabelContent={(info) => {
            const hours = info.date.getHours()
            const period = hours >= 12 ? 'pm' : 'am'
            const normalizedHour = hours % 12 === 0 ? 12 : hours % 12

            return `${normalizedHour}${period}`
          }}
        />
      </div>

      <EventListModal
        canManage={canManage}
        events={selectedDayEvents}
        onClose={() => {
          setSelectedDateKey(null)
          setSelectedEventId(null)
        }}
        onDeleteEvent={async (id) => {
          if (!canManage) {
            return
          }

          try {
            await deleteEventMutation.mutateAsync(id)
            toast.success('Evento eliminado correctamente.')
            setSelectedDateKey(null)
            setSelectedEventId(null)
          } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo eliminar el evento.'
            toast.error(message)
          }
        }}
        onEditEvent={(id) => {
          if (!canManage || !onEditEvent) {
            return
          }

          onEditEvent(id)
          setSelectedDateKey(null)
          setSelectedEventId(null)
        }}
        onSelectEvent={(id) => setSelectedEventId(id)}
        open={Boolean(selectedDateKey) && selectedDayEvents.length > 0}
        selectedEventId={selectedEventId}
      />
    </Paper>
  )
}
