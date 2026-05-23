import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultimediaApi } from "@/api/MultimediaApi";
import { MULTIMEDIA_QUERY_KEY } from "./useMultimediaQuery";

export default function useCreateMultimediaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MultimediaApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MULTIMEDIA_QUERY_KEY });
    },
  });
}
