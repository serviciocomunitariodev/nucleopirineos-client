import { useQuery } from "@tanstack/react-query";
import { AcademicLevelApi } from "@/api/AcademicLevelApi";

export default function useAcademicLevelsQuery() {
  return useQuery({
    queryKey: ["academic-levels"],
    queryFn: AcademicLevelApi.getAll,
  });
}
