import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InformationApi } from "@/api/InformationApi";
import { informationByIdQueryKey } from "@/hooks/useInformationQuery";
import { INFORMATION_QUERY_KEY } from "@/hooks/useInformationsQuery";
import type { InformationPayload } from "@/types/information";

type UpdateInformationInput = {
  id: number;
  payload: InformationPayload;
};

export default function useUpdateInformationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateInformationInput) => InformationApi.update(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: INFORMATION_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: informationByIdQueryKey(variables.id) });
    },
  });
}
