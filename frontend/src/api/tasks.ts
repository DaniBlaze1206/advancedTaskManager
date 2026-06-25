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

export type UpdateTaskInput = {
  title?: string
  description?: string
  list?: string
  position?: number
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

export async function updateTask(
  projectId: string,
  listId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const { data } = await apiClient.patch<TaskEnvelope>(
    `/projects/${projectId}/lists/${listId}/tasks/${taskId}`,
    input,
  )
  return data.data
}

export async function deleteTask(
  projectId: string,
  listId: string,
  taskId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/lists/${listId}/tasks/${taskId}`,
  )
}