import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubjectApi, type CreateSubjectPayload } from "@/api/SubjectApi";
import { SUBJECTS_QUERY_KEY } from "@/hooks/useSubjectsQuery";

export default function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubjectPayload) => SubjectApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}
