import { useQuery } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'

export const eventQueryKey = (id: number) => ['events', id] as const

export default function useEventQuery(id: number) {
  return useQuery({
    queryKey: eventQueryKey(id),
    queryFn: () => EventApi.getById(id),
    enabled: !!id,
  })
}
