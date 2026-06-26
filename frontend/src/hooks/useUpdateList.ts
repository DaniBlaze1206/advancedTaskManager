import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateList, type List, type UpdateListInput } from '../api/lists'
import { qk } from '../lib/queryKeys'

type UpdateListVariables = {
  projectId: string
  listId: string
  input: UpdateListInput
}

export function useUpdateList() {
  const queryClient = useQueryClient()

  return useMutation<List, Error, UpdateListVariables>({
    mutationFn: ({ projectId, listId, input }) =>
      updateList(projectId, listId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}