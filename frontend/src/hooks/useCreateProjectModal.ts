import { useContext } from 'react'
import { CreateProjectModalContext } from '../context/CreateProjectModalContext'

export function useCreateProjectModal() {
  const value = useContext(CreateProjectModalContext)
  if (value === null) {
    throw new Error(
      'useCreateProjectModal must be used inside a CreateProjectModalProvider',
    )
  }
  return value
}