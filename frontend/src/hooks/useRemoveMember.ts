import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeMember } from '../api/projects'
import { qk } from '../lib/queryKeys'

type RemoveMemberVariables = {
  projectId: string
  userId: string
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, RemoveMemberVariables>({
    mutationFn: ({ projectId, userId }) => removeMember(projectId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}