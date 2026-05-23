import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultimediaApi } from "@/api/MultimediaApi";
import { MULTIMEDIA_QUERY_KEY } from "./useMultimediaQuery";

export default function useDeleteMultimediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MultimediaApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MULTIMEDIA_QUERY_KEY });
    },
  });
}
