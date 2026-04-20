import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SongCategoryApi, type UpdateSongCategoryPayload } from '@/api/SongCategoryApi'
import { songCategoryByIdQueryKey } from '@/hooks/useSongCategoryQuery'
import { SONG_CATEGORIES_QUERY_KEY } from '@/hooks/useSongCategoriesQuery'

type UpdateSongCategoryInput = {
  id: number
  payload: UpdateSongCategoryPayload
}

export default function useUpdateSongCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSongCategoryInput) => SongCategoryApi.update(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: SONG_CATEGORIES_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: songCategoryByIdQueryKey(variables.id) })
    },
  })
}
