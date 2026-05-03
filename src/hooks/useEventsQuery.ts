import { useQuery } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'

export const EVENTS_QUERY_KEY = ['events'] as const

export default function useEventsQuery() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: EventApi.getAll,
  })
}
