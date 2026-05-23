import { useQuery } from "@tanstack/react-query";
import { MultimediaApi } from "@/api/MultimediaApi";

export const MULTIMEDIA_ITEM_QUERY_KEY = ["multimedia", "item"] as const;

export default function useMultimediaItemQuery(id: number | null) {
  return useQuery({
    queryKey: [...MULTIMEDIA_ITEM_QUERY_KEY, id ?? "none"],
    queryFn: () => {
      if (!id) {
        throw new Error("ID invalido");
      }

      return MultimediaApi.getById(id);
    },
    enabled: Boolean(id),
  });
}
