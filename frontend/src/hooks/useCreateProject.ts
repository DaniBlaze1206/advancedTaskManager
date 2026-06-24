import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createProject,
  type CreateProjectInput,
  type Project,
} from '../api/projects'
import { qk } from '../lib/queryKeys'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.projects })
    },
  })
}