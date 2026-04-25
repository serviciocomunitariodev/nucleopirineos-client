import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EducationalMaterialApi } from '@/api/EducationalMaterialApi'
import { EDUCATIONAL_MATERIALS_QUERY_KEY } from './useEducationalMaterialsQuery'

export default function useCreateEducationalMaterialMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: EducationalMaterialApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATIONAL_MATERIALS_QUERY_KEY })
    },
  })
}
