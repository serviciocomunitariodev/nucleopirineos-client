import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersApi, type UpdateUserPayload } from "@/api/UsersApi";
import { professorByUserIdQueryKey } from "@/hooks/useProfessorByUserIdQuery";
import { PROFESSORS_QUERY_KEY } from "@/hooks/useProfessorsQuery";

type UpdateProfessorInput = {
  userId: number;
  professorId: number;
  user: UpdateUserPayload;
  professor: {
    subjectIds: number[];
    academicLevelIds: number[];
  };
};

export default function useUpdateProfessorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfessorInput) => {
      await UsersApi.updateUser(input.userId, input.user);

      const updatedProfessor = await UsersApi.updateProfessor(input.professorId, {
        subjectIds: input.professor.subjectIds,
        academicLevelIds: input.professor.academicLevelIds,
      });

      return updatedProfessor;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: PROFESSORS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: professorByUserIdQueryKey(variables.userId) });
    },
  });
}
