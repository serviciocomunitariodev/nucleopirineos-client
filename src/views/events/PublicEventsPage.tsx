import { usePageTitle } from '@/hooks/usePageTitle'
import EventCalendarCore from '@/views/events/components/EventCalendarCore'
import LandingLayout from '@/views/landing/layout/LandingLayout'

export default function PublicEventsPage() {
  usePageTitle('Calendario')

  return (
    <LandingLayout headerVariant='back-only'>
      <main className='w-full bg-superficies py-6'>
        <div className='mx-auto w-full max-w-[1400px] px-4 lg:px-5'>
          <EventCalendarCore title='Calendario publico de eventos' />
        </div>
      </main>
    </LandingLayout>
  )
}
