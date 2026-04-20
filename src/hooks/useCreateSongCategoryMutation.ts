import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SongCategoryApi, type CreateSongCategoryPayload } from '@/api/SongCategoryApi'
import { SONG_CATEGORIES_QUERY_KEY } from '@/hooks/useSongCategoriesQuery'

export default function useCreateSongCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSongCategoryPayload) => SongCategoryApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SONG_CATEGORIES_QUERY_KEY })
    },
  })
}
