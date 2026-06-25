import { apiClient } from './client'

export type Task = {
  _id: string
  title: string
  description?: string
  list: string
  position: number
  createdAt?: string
  updatedAt?: string
}

export type CreateTaskInput = {
  title: string
  description?: string
}

type TaskEnvelope = {
  success: true
  data: Task
}

export async function createTask(
  projectId: string,
  listId: string,
  input: CreateTaskInput,
): Promise<Task> {
  const { data } = await apiClient.post<TaskEnvelope>(
    `/projects/${projectId}/lists/${listId}/tasks`,
    input,
  )
  return data.data
}