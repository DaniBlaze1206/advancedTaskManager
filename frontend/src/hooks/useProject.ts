import { useQuery } from '@tanstack/react-query'
import { getProject, type ProjectDetail } from '../api/projects'
import { qk } from '../lib/queryKeys'

export function useProject(projectId: string) {
  return useQuery<ProjectDetail, Error>({
    queryKey: qk.project(projectId),
    queryFn: () => getProject(projectId),
  })
}