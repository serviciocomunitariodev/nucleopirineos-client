import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersApi } from '@/api/UsersApi'

export default function useDeleteStudentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => UsersApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
