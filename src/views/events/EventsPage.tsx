import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Paper, Typography } from "@mui/material";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function EventsPage() {
  usePageTitle("Calendario");

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Calendario de eventos
      </Typography>
      <FullCalendar plugins={[dayGridPlugin, timeGridPlugin]} initialView="dayGridMonth" />
    </Paper>
  );
}
