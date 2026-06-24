import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import PageLoader from '../components/ui/PageLoader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import type { Project } from '../api/projects'

function ProjectsPage() {
  const { session } = useAuth()
  const projectsQuery = useProjects()

  // null = closed; undefined = create mode; Project = edit mode.
  const [modalProject, setModalProject] = useState<Project | null | undefined>(
    null,
  )

  const currentUserId = session?.user._id

  function openCreateModal() {
    setModalProject(undefined)
  }

  function openEditModal(project: Project) {
    setModalProject(project)
  }

  function closeModal() {
    setModalProject(null)
  }

  if (projectsQuery.isPending) {
    return <PageLoader />
  }

  if (projectsQuery.isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
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
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
        <Button onClick={openCreateModal}>+ New project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={<Button onClick={openCreateModal}>+ New project</Button>}
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
            />
          ))}
        </div>
      )}

      {modalProject !== null && (
        <ProjectFormModal
          onClose={closeModal}
          editingProject={modalProject}
        />
      )}
    </div>
  )
}

export default ProjectsPage