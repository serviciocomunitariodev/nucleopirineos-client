import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersApi, type CreateUserPayload } from "@/api/UsersApi";
import { STUDENTS_QUERY_KEY } from "@/hooks/useStudentsQuery";

type CreateStudentInput = {
  user: Omit<CreateUserPayload, "role">;
  student: {
    age: number;
    principalSubjectId?: number;
    complementarySubjectIds?: number[];
  };
};

export default function useCreateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStudentInput) => {
      const createdUser = await UsersApi.createUser({
        ...input.user,
        role: "STUDENT",
      });

      return UsersApi.createStudent({
        userId: createdUser.id,
        age: input.student.age,
        principalSubjectId: input.student.principalSubjectId,
        complementarySubjectIds: input.student.complementarySubjectIds,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
