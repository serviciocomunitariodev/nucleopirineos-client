import { useQuery } from '@tanstack/react-query'
import { EducationalMaterialApi } from '@/api/EducationalMaterialApi'

export const educationalMaterialQueryKey = (id: number) => ['educational-materials', id] as const

export default function useEducationalMaterialQuery(id: number) {
  return useQuery({
    queryKey: educationalMaterialQueryKey(id),
    queryFn: () => EducationalMaterialApi.getById(id),
    enabled: !!id,
  })
}
