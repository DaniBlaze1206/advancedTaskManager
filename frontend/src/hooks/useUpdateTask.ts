import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type Task, type UpdateTaskInput } from '../api/tasks'
import { qk } from '../lib/queryKeys'

type UpdateTaskVariables = {
  projectId: string
  listId: string
  taskId: string
  input: UpdateTaskInput
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: ({ projectId, listId, taskId, input }) =>
      updateTask(projectId, listId, taskId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}