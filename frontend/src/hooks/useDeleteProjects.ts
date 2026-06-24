import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject } from '../api/projects'
import { qk } from '../lib/queryKeys'

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.projects })
    },
  })
}