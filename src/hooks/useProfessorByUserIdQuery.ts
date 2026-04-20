import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/api/UsersApi";

export const professorByUserIdQueryKey = (userId: number) =>
  ["users", "professor-by-user-id", userId] as const;

export default function useProfessorByUserIdQuery(userId: number | null) {
  return useQuery({
    queryKey: userId ? professorByUserIdQueryKey(userId) : ["users", "professor-by-user-id", "idle"],
    queryFn: () => UsersApi.getProfessorByUserId(userId as number),
    enabled: userId !== null,
  });
}
