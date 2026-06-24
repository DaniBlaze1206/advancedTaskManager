import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateProject,
  type UpdateProjectInput,
  type Project,
} from '../api/projects'
import { qk } from '../lib/queryKeys'

type UpdateProjectVariables = {
  projectId: string
  input: UpdateProjectInput
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation<Project, Error, UpdateProjectVariables>({
    mutationFn: ({ projectId, input }) => updateProject(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.projects })
    },
  })
}