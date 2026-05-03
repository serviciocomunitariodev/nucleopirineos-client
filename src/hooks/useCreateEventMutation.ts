import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'
import { EVENTS_QUERY_KEY } from './useEventsQuery'

export default function useCreateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: EventApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
    },
  })
}
