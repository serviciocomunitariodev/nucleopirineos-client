import { useQuery } from '@tanstack/react-query'
import { SongApi } from '@/api/SongApi'

export const songQueryKey = (id: number) => ['songs', id] as const

export default function useSongQuery(id: number) {
  return useQuery({
    queryKey: songQueryKey(id),
    queryFn: () => SongApi.getById(id),
    enabled: !!id,
  })
}
