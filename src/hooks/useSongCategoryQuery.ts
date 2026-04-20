import { useQuery } from '@tanstack/react-query'
import { SongCategoryApi } from '@/api/SongCategoryApi'

export const songCategoryByIdQueryKey = (id: number) => ['song-categories', 'by-id', id] as const

export default function useSongCategoryQuery(id: number | null) {
  return useQuery({
    queryKey: id ? songCategoryByIdQueryKey(id) : ['song-categories', 'by-id', 'idle'],
    queryFn: () => SongCategoryApi.getById(id as number),
    enabled: id !== null,
  })
}
