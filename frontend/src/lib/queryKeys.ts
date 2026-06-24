export const qk = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
}