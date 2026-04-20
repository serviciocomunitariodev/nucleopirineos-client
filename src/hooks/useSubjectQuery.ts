import { useQuery } from "@tanstack/react-query";
import { SubjectApi } from "@/api/SubjectApi";

export const subjectByIdQueryKey = (id: number) => ["subjects", "by-id", id] as const;

export default function useSubjectQuery(id: number | null) {
  return useQuery({
    queryKey: id ? subjectByIdQueryKey(id) : ["subjects", "by-id", "idle"],
    queryFn: () => SubjectApi.getById(id as number),
    enabled: id !== null,
  });
}
