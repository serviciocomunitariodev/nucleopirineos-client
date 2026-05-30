import { useQuery } from "@tanstack/react-query";
import { InformationApi } from "@/api/InformationApi";
import type { InformationSection } from "@/types/information";

export const INFORMATION_QUERY_KEY = ["information"] as const;

type InformationFilters = {
  section?: InformationSection;
};

export default function useInformationsQuery(filters: InformationFilters = {}) {
  return useQuery({
    queryKey: [
      ...INFORMATION_QUERY_KEY,
      filters.section ?? "all",
    ],
    queryFn: () => InformationApi.getAll(filters),
  });
}
