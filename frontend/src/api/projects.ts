import { apiClient } from './client'
import type { List } from './lists'

export type User = {
  _id: string
  username: string
  email: string
}

export type Project = {
  _id: string
  name: string
  description: string
  owner: string
  members: string[]
}

export type ProjectDetail = {
  _id: string
  name: string
  description: string
  owner: User
  members: User[]
  lists: List[]
  createdAt?: string
  updatedAt?: string
}

export type CreateProjectInput = {
  name: string
  description?: string
  members?: string[]
}

export type UpdateProjectInput = {
  name?: string
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

type ProjectDetailEnvelope = {
  success: true
  data: ProjectDetail
}

type SimpleEnvelope = {
  success: true
  message: string
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ProjectsEnvelope>('/projects')
  return data.data
}

export async function getProject(projectId: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetailEnvelope>(
    `/projects/${projectId}`,
  )
  return data.data
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const { data } = await apiClient.post<ProjectEnvelope>('/projects', input)
  return data.data
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const { data } = await apiClient.patch<ProjectEnvelope>(
    `/projects/${projectId}`,
    input,
  )
  return data.data
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiClient.delete(`/projects/${projectId}`)
}

export async function addMember(
  projectId: string,
  username: string,
): Promise<void> {
  await apiClient.post<SimpleEnvelope>(`/projects/${projectId}/members`, {
    username,
  })
}

export async function removeMember(
  projectId: string,
  userId: string,
): Promise<void> {
  await apiClient.delete<SimpleEnvelope>(
    `/projects/${projectId}/members/${userId}`,
  )
}

export async function transferOwnership(
  projectId: string,
  newOwnerId: string,
): Promise<void> {
  await apiClient.patch<SimpleEnvelope>(
    `/projects/${projectId}/transfer`,
    { newOwnerId },
  )
}

