import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InformationApi } from "@/api/InformationApi";
import { INFORMATION_QUERY_KEY } from "@/hooks/useInformationsQuery";
import type { InformationPayload } from "@/types/information";

export default function useCreateInformationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InformationPayload) => InformationApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: INFORMATION_QUERY_KEY });
    },
  });
}
