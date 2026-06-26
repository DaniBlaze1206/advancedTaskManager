import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteList } from '../api/lists'
import { qk } from '../lib/queryKeys'

type DeleteListVariables = {
  projectId: string
  listId: string
}

export function useDeleteList() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteListVariables>({
    mutationFn: ({ projectId, listId }) => deleteList(projectId, listId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}