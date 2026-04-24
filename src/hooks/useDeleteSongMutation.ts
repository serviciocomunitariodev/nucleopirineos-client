import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SongApi } from '@/api/SongApi'
import { SONGS_QUERY_KEY } from './useSongsQuery'

export default function useDeleteSongMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: SongApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SONGS_QUERY_KEY })
    },
  })
}
