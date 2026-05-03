import { usePageTitle } from '@/hooks/usePageTitle'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { UserRole } from '@/types/user'
import EventCalendarCore from '@/views/events/components/EventCalendarCore'

export default function PlatformEventsPage() {
  usePageTitle('Calendario')
  const navigate = useNavigate()
  const userRole = useAppStore((state) => state.user.role)
  const canManageEvents = userRole === UserRole.PROFESSOR || userRole === UserRole.ADMIN

  return (
    <EventCalendarCore
      canManage={canManageEvents}
      onCreateClick={() => navigate('/platform/events/new')}
      onEditEvent={(id) => navigate(`/platform/events/${id}/edit`)}
      title='Calendario de la plataforma'
      visibility='platform'
    />
  )
}
