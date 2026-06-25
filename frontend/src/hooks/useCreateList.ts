import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createList, type CreateListInput, type List } from '../api/lists'
import { qk } from '../lib/queryKeys'

type CreateListVariables = {
  projectId: string
  input: CreateListInput
}

export function useCreateList() {
  const queryClient = useQueryClient()

  return useMutation<List, Error, CreateListVariables>({
    mutationFn: ({ projectId, input }) => createList(projectId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}