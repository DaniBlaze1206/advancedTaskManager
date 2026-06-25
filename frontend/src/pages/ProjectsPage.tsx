import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { useCreateProjectModal } from '../hooks/useCreateProjectModal'
import PageLoader from '../components/ui/PageLoader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import DeleteProjectDialog from '../components/projects/DeleteProjectDialog'
import type { Project } from '../api/projects'

function ProjectsPage() {
  const { session } = useAuth()
  const projectsQuery = useProjects()
  const createModal = useCreateProjectModal()

  // Local state only for the EDIT flow now. Create is handled globally.
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const currentUserId = session?.user._id

  function openEditModal(project: Project) {
    setEditingProject(project)
  }

  function closeEditModal() {
    setEditingProject(null)
  }

  function openDeleteDialog(project: Project) {
    setDeletingProject(project)
  }

  function closeDeleteDialog() {
    setDeletingProject(null)
  }

  if (projectsQuery.isPending) {
    return <PageLoader />
  }

  if (projectsQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-6xl flex-col items-center justify-center text-center">
        <h2 className="text-base font-semibold text-slate-900">
          Couldn’t load your projects
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          {projectsQuery.error.message}
        </p>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => projectsQuery.refetch()}
            isLoading={projectsQuery.isFetching}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  const projects = projectsQuery.data

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
        <Button onClick={createModal.open}>+ New project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={<Button onClick={createModal.open}>+ New project</Button>}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isOwner={project.owner === currentUserId}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      {editingProject !== null && (
        <ProjectFormModal
          onClose={closeEditModal}
          editingProject={editingProject}
        />
      )}

      {deletingProject !== null && (
        <DeleteProjectDialog
          project={deletingProject}
          onClose={closeDeleteDialog}
        />
      )}
    </div>
  )
}

export default ProjectsPage