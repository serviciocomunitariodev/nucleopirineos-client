import { useQuery } from "@tanstack/react-query";
import { AcademicLevelApi } from "@/api/AcademicLevelApi";

export const academicLevelByIdQueryKey = (id: number) => ["academic-levels", "by-id", id] as const;

export default function useAcademicLevelQuery(id: number | null) {
  return useQuery({
    queryKey: id ? academicLevelByIdQueryKey(id) : ["academic-levels", "by-id", "idle"],
    queryFn: () => AcademicLevelApi.getById(id as number),
    enabled: id !== null,
  });
}
