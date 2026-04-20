import { useQuery } from '@tanstack/react-query'
import { SongCategoryApi } from '@/api/SongCategoryApi'

export const SONG_CATEGORIES_QUERY_KEY = ['song-categories'] as const

export default function useSongCategoriesQuery() {
  return useQuery({
    queryKey: SONG_CATEGORIES_QUERY_KEY,
    queryFn: SongCategoryApi.getAll,
  })
}
