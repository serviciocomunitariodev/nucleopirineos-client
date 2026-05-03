import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'
import { EVENTS_QUERY_KEY } from './useEventsQuery'

export default function useDeleteEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => EventApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
    },
  })
}
