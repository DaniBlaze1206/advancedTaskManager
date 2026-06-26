import { createContext } from 'react'

export type CreateProjectModalContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const CreateProjectModalContext =
  createContext<CreateProjectModalContextValue | null>(null)