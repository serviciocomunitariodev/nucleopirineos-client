import { useQuery } from '@tanstack/react-query'
import { SongApi } from '@/api/SongApi'

export const SONGS_QUERY_KEY = ['songs'] as const

export default function useSongsQuery() {
  return useQuery({
    queryKey: SONGS_QUERY_KEY,
    queryFn: SongApi.getAll,
  })
}
