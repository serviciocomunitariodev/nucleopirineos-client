import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EducationalMaterialApi } from '@/api/EducationalMaterialApi'
import { EDUCATIONAL_MATERIALS_QUERY_KEY } from './useEducationalMaterialsQuery'

type UpdateEducationalMaterialInput = {
  id: number
  payload: Parameters<typeof EducationalMaterialApi.update>[1]
}

export default function useUpdateEducationalMaterialMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateEducationalMaterialInput) =>
      EducationalMaterialApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATIONAL_MATERIALS_QUERY_KEY })
    },
  })
}
