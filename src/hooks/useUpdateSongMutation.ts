import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SongApi, type UpdateSongPayload } from '@/api/SongApi'
import { SONGS_QUERY_KEY } from './useSongsQuery'
import { songQueryKey } from './useSongQuery'

export default function useUpdateSongMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSongPayload }) =>
      SongApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SONGS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: songQueryKey(id) })
    },
  })
}
