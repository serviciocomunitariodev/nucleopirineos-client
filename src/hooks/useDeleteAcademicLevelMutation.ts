import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcademicLevelApi } from "@/api/AcademicLevelApi";
import { ACADEMIC_LEVELS_QUERY_KEY } from "@/hooks/useAcademicLevelsQuery";

export default function useDeleteAcademicLevelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AcademicLevelApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ACADEMIC_LEVELS_QUERY_KEY });
    },
  });
}
