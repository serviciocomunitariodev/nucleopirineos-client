import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubjectApi, type UpdateSubjectPayload } from "@/api/SubjectApi";
import { subjectByIdQueryKey } from "@/hooks/useSubjectQuery";
import { SUBJECTS_QUERY_KEY } from "@/hooks/useSubjectsQuery";

type UpdateSubjectInput = {
  id: number;
  payload: UpdateSubjectPayload;
};

export default function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSubjectInput) => SubjectApi.update(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: subjectByIdQueryKey(variables.id) });
    },
  });
}
