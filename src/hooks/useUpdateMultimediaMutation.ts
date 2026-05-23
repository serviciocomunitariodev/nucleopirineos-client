import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultimediaApi } from "@/api/MultimediaApi";
import { MULTIMEDIA_QUERY_KEY } from "./useMultimediaQuery";

type UpdateArgs = {
  id: number;
  payload: Parameters<typeof MultimediaApi.update>[1];
};

export default function useUpdateMultimediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateArgs) => MultimediaApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MULTIMEDIA_QUERY_KEY });
    },
  });
}
