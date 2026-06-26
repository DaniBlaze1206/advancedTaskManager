import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMember } from '../api/projects'
import { qk } from '../lib/queryKeys'

type AddMemberVariables = {
  projectId: string
  username: string
}

export function useAddMember() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AddMemberVariables>({
    mutationFn: ({ projectId, username }) => addMember(projectId, username),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}