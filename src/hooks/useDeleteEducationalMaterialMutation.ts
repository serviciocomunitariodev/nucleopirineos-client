import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EducationalMaterialApi } from '@/api/EducationalMaterialApi'

export default function useDeleteEducationalMaterialMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => EducationalMaterialApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationalMaterials'] })
    },
  })
}
