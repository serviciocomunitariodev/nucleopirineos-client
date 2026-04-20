import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SongCategoryApi } from '@/api/SongCategoryApi'
import { SONG_CATEGORIES_QUERY_KEY } from '@/hooks/useSongCategoriesQuery'

export default function useDeleteSongCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => SongCategoryApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SONG_CATEGORIES_QUERY_KEY })
    },
  })
}
