import { useQuery } from '@tanstack/react-query'
import { getProjects, type Project } from '../api/projects'
import { qk } from '../lib/queryKeys'

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: qk.projects,
    queryFn: getProjects,
  })
}