import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/api/UsersApi";

export const PROFESSORS_QUERY_KEY = ["users", "professors"] as const;

export default function useProfessorsQuery() {
  return useQuery({
    queryKey: PROFESSORS_QUERY_KEY,
    queryFn: () => UsersApi.getProfessors(),
  });
}
