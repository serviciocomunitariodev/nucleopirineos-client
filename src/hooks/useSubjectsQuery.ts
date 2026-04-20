import { useQuery } from "@tanstack/react-query";
import { SubjectApi } from "@/api/SubjectApi";
import { SubjectType } from "@/types/subject";

export const SUBJECTS_QUERY_KEY = ["subjects"] as const;

type UseSubjectsQueryInput = {
  type?: SubjectType;
};

export default function useSubjectsQuery(input: UseSubjectsQueryInput = {}) {
  return useQuery({
    queryKey: [...SUBJECTS_QUERY_KEY, input.type ?? "ALL"],
    queryFn: async () => SubjectApi.getAll(input),
  });
}
