import { useQuery } from "@tanstack/react-query";
import { AcademicLevelApi } from "@/api/AcademicLevelApi";

export const ACADEMIC_LEVELS_QUERY_KEY = ["academic-levels"] as const;

export default function useAcademicLevelsQuery() {
  return useQuery({
    queryKey: ACADEMIC_LEVELS_QUERY_KEY,
    queryFn: AcademicLevelApi.getAll,
  });
}
