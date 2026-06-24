import { apiClient } from './client'

export type Project = {
  _id: string
  name: string
  description: string
  owner: string         // user _id
  members: string[]     // array of user _ids
}

type ProjectsEnvelope = {
  success: true
  data: Project[]
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ProjectsEnvelope>('/projects')
  return data.data
}