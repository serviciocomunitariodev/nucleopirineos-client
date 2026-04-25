import { useQuery } from '@tanstack/react-query'
import { EducationalMaterialApi } from '@/api/EducationalMaterialApi'

export const EDUCATIONAL_MATERIALS_QUERY_KEY = ['educational-materials'] as const

export default function useEducationalMaterialsQuery() {
  return useQuery({
    queryKey: EDUCATIONAL_MATERIALS_QUERY_KEY,
    queryFn: EducationalMaterialApi.getAll,
  })
}
