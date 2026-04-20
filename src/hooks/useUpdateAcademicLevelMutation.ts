import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicLevelApi, type UpdateAcademicLevelPayload } from "@/api/AcademicLevelApi";
import { academicLevelByIdQueryKey } from "@/hooks/useAcademicLevelQuery";
import { ACADEMIC_LEVELS_QUERY_KEY } from "@/hooks/useAcademicLevelsQuery";

type UpdateAcademicLevelInput = {
  id: number;
  payload: UpdateAcademicLevelPayload;
};

export default function useUpdateAcademicLevelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAcademicLevelInput) =>
      AcademicLevelApi.update(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ACADEMIC_LEVELS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: academicLevelByIdQueryKey(variables.id) });
    },
  });
}
