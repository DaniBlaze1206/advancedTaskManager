import { useMutation, useQueryClient } from '@tanstack/react-query'
import { transferOwnership } from '../api/projects'
import { qk } from '../lib/queryKeys'

type TransferOwnershipVariables = {
  projectId: string
  newOwnerId: string
}

export function useTransferOwnership() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, TransferOwnershipVariables>({
    mutationFn: ({ projectId, newOwnerId }) =>
      transferOwnership(projectId, newOwnerId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
      // Also invalidate the lightweight projects list, since `owner` changed.
      queryClient.invalidateQueries({ queryKey: qk.projects })
    },
  })
}