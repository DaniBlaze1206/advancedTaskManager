import { apiClient } from './client'

export type Project = {
  _id: string
  name: string
  description: string
  owner: string        
  members: string[]    
}

export type CreateProjectInput = {
  name: string
  description?: string
}

type ProjectsEnvelope = {
  success: true
  data: Project[]
}

type ProjectEnvelope = {
  success: true
  data: Project
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ProjectsEnvelope>('/projects')
  return data.data
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const { data } = await apiClient.post<ProjectEnvelope>('/projects', input)
  return data.data
}