import { useQuery } from "@tanstack/react-query";
import { UsersApi } from "@/api/UsersApi";

export const STUDENTS_QUERY_KEY = ["users", "students"] as const;

export default function useStudentsQuery() {
  return useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: () => UsersApi.getStudents(),
  });
}
