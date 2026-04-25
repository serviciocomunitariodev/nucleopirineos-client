import { usePageTitle } from "@/hooks/usePageTitle";
import EventCalendarCore from "@/views/events/components/EventCalendarCore";

export default function EventsPage() {
  usePageTitle("Calendario");

  return <EventCalendarCore title="Calendario de eventos" />;
}
