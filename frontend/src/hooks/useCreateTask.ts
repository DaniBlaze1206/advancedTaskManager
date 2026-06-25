import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, type CreateTaskInput, type Task } from '../api/tasks'
import { qk } from '../lib/queryKeys'

type CreateTaskVariables = {
  projectId: string
  listId: string
  input: CreateTaskInput
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation<Task, Error, CreateTaskVariables>({
    mutationFn: ({ projectId, listId, input }) =>
      createTask(projectId, listId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.project(variables.projectId),
      })
    },
  })
}