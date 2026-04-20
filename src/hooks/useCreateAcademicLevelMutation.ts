import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicLevelApi, type CreateAcademicLevelPayload } from "@/api/AcademicLevelApi";
import { ACADEMIC_LEVELS_QUERY_KEY } from "@/hooks/useAcademicLevelsQuery";

export default function useCreateAcademicLevelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAcademicLevelPayload) => AcademicLevelApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ACADEMIC_LEVELS_QUERY_KEY });
    },
  });
}
