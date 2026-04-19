import { useQuery } from "@tanstack/react-query";
import { SubjectApi } from "@/api/SubjectApi";
import { SubjectType } from "@/types/subject";

type UseSubjectsQueryInput = {
  type?: SubjectType;
};

export default function useSubjectsQuery(input: UseSubjectsQueryInput = {}) {
  return useQuery({
    queryKey: ["subjects", input.type ?? "ALL"],
    queryFn: async () => SubjectApi.getAll(input),
  });
}
