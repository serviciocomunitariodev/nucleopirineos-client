import { useQuery } from "@tanstack/react-query";
import { InformationApi } from "@/api/InformationApi";

export const informationByIdQueryKey = (id: number) => ["information", "by-id", id] as const;

export default function useInformationQuery(id: number | null) {
  return useQuery({
    queryKey: id ? informationByIdQueryKey(id) : ["information", "by-id", "idle"],
    queryFn: () => InformationApi.getById(id as number),
    enabled: id !== null,
  });
}
