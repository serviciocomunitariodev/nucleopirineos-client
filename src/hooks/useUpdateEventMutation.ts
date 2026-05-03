import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EventApi } from '@/api/EventApi'
import { EVENTS_QUERY_KEY } from './useEventsQuery'

type UpdateEventInput = {
  id: number
  payload: Parameters<typeof EventApi.update>[1]
}

export default function useUpdateEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateEventInput) => EventApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
    },
  })
}
