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