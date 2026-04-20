import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersApi, type CreateUserPayload } from "@/api/UsersApi";
import { PROFESSORS_QUERY_KEY } from "@/hooks/useProfessorsQuery";

type CreateProfessorInput = {
  user: Omit<CreateUserPayload, "role">;
  professor: {
    subjectIds?: number[];
    academicLevelIds?: number[];
  };
};

export default function useCreateProfessorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProfessorInput) => {
      const createdUser = await UsersApi.createUser({
        ...input.user,
        role: "PROFESSOR",
      });

      return UsersApi.createProfessor({
        userId: createdUser.id,
        subjectIds: input.professor.subjectIds,
        academicLevelIds: input.professor.academicLevelIds,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFESSORS_QUERY_KEY });
    },
  });
}
