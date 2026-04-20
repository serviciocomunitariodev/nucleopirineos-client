import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubjectApi } from "@/api/SubjectApi";
import { SUBJECTS_QUERY_KEY } from "@/hooks/useSubjectsQuery";

export default function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SubjectApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
  });
}
