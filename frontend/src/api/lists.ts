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