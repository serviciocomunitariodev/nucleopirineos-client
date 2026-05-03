import { useQuery } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'

export const EVENTS_QUERY_KEY = ['events'] as const

type UseEventsQueryInput = {
  visibility?: 'public' | 'platform'
}

export default function useEventsQuery(input: UseEventsQueryInput = {}) {
  const visibility = input.visibility ?? 'public'

  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, visibility],
    queryFn: visibility === 'platform' ? EventApi.getVisible : EventApi.getAll,
  })
}
