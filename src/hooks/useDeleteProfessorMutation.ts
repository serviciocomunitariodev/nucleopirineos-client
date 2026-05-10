import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersApi } from '@/api/UsersApi'

export default function useDeleteProfessorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => UsersApi.deleteProfessor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] })
    },
  })
}
