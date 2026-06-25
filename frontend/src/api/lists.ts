import { apiClient } from './client'
import type { Task } from './tasks'

export type List = {
  _id: string
  name: string
  project: string
  position: number
  tasks: Task[]
  createdAt?: string
  updatedAt?: string
}

export type CreateListInput = {
  name: string
}

export type UpdateListInput = {
  name?: string
  position?: number
}

type ListEnvelope = {
  success: true
  data: List
}

export async function createList(
  projectId: string,
  input: CreateListInput,
): Promise<List> {
  const { data } = await apiClient.post<ListEnvelope>(
    `/projects/${projectId}/lists`,
    input,
  )
  return data.data
}

export async function updateList(
  projectId: string,
  listId: string,
  input: UpdateListInput,
): Promise<List> {
  const { data } = await apiClient.patch<ListEnvelope>(
    `/projects/${projectId}/lists/${listId}`,
    input,
  )
  return data.data
}

export async function deleteList(
  projectId: string,
  listId: string,
): Promise<void> {
  await apiClient.delete(`/projects/${projectId}/lists/${listId}`)
}