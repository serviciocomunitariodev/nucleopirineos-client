import { useQuery } from "@tanstack/react-query";
import { MultimediaApi } from "@/api/MultimediaApi";
import type { MultimediaSection } from "@/types/multimedia";

export const MULTIMEDIA_QUERY_KEY = ["multimedia"] as const;

type MultimediaFilters = {
  section?: MultimediaSection;
  onlyActive?: boolean;
};

export default function useMultimediaQuery(filters: MultimediaFilters = {}) {
  return useQuery({
    queryKey: [
      ...MULTIMEDIA_QUERY_KEY,
      filters.section ?? "all",
      filters.onlyActive ?? "default",
    ],
    queryFn: () => MultimediaApi.getAll(filters),
  });
}
