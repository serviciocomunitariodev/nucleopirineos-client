import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/api/UsersApi";

export const studentByUserIdQueryKey = (userId: number) =>
  ["users", "student-by-user-id", userId] as const;

export default function useStudentByUserIdQuery(userId: number | null) {
  return useQuery({
    queryKey: userId ? studentByUserIdQueryKey(userId) : ["users", "student-by-user-id", "idle"],
    queryFn: () => UsersApi.getStudentByUserId(userId as number),
    enabled: userId !== null,
  });
}
