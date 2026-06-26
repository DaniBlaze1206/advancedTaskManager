import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '../api/tasks'
import { qk } from '../lib/queryKeys'

type DeleteTaskVariables = {
  projectId: string
  listId: string
  taskId: string
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteTaskVariables>({
    mutationFn: ({ projectId, listId, taskId }) =>
      deleteTask(projectId, listId, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}