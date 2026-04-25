import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Paper, Typography } from '@mui/material'

type EventCalendarCoreProps = {
  title?: string
}

export default function EventCalendarCore({ title = 'Calendario de eventos' }: EventCalendarCoreProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography gutterBottom variant='h5'>
        {title}
      </Typography>
      <FullCalendar plugins={[dayGridPlugin, timeGridPlugin]} initialView='dayGridMonth' />
    </Paper>
  )
}
