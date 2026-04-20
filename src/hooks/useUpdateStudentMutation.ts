import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersApi, type UpdateUserPayload } from "@/api/UsersApi";
import { studentByUserIdQueryKey } from "@/hooks/useStudentByUserIdQuery";
import { STUDENTS_QUERY_KEY } from "@/hooks/useStudentsQuery";

type UpdateStudentInput = {
  userId: number;
  studentId: number;
  user: UpdateUserPayload;
  student: {
    age: number;
    principalSubjectId: number | null;
    complementarySubjectIds: number[];
  };
};

export default function useUpdateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateStudentInput) => {
      await UsersApi.updateUser(input.userId, input.user);

      const updatedStudent = await UsersApi.updateStudent(input.studentId, {
        age: input.student.age,
        principalSubjectId: input.student.principalSubjectId,
        complementarySubjectIds: input.student.complementarySubjectIds,
      });

      return updatedStudent;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: studentByUserIdQueryKey(variables.userId) });
    },
  });
}
