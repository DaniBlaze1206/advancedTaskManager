import { useState, type ReactNode } from 'react'
import { CreateProjectModalContext } from './CreateProjectModalContext'
import ProjectFormModal from '../components/projects/ProjectFormModal'

type CreateProjectModalProviderProps = {
  children: ReactNode
}

function CreateProjectModalProvider({
  children,
}: CreateProjectModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CreateProjectModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
      {isOpen && (
        <ProjectFormModal
          onClose={() => setIsOpen(false)}
          editingProject={undefined}
        />
      )}
    </CreateProjectModalContext.Provider>
  )
}

export default CreateProjectModalProvider