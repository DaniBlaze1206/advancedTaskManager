import { NavLink, useParams } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { useCreateProjectModal } from '../../hooks/useCreateProjectModal'
import Spinner from '../ui/Spinner'

function ProjectsSidebar() {
  const { projectId: activeProjectId } = useParams<{ projectId: string }>()
  const projectsQuery = useProjects()
  const createModal = useCreateProjectModal()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Projects
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {projectsQuery.isPending ? (
          <div className="flex justify-center p-4">
            <Spinner size="sm" />
          </div>
        ) : projectsQuery.isError ? (
          <p className="p-2 text-xs text-red-600">
            Failed to load projects
          </p>
        ) : projectsQuery.data.length === 0 ? (
          <p className="p-2 text-xs text-slate-500">No projects yet.</p>
        ) : (
          <nav className="flex flex-col gap-1">
            {projectsQuery.data.map((project) => (
              <NavLink
                key={project._id}
                to={`/projects/${project._id}`}
                className={
                  project._id === activeProjectId
                    ? 'truncate rounded-md bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-700'
                    : 'truncate rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100'
                }
              >
                {project.name}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={createModal.open}
          className="flex w-full items-center justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New project
        </button>
      </div>
    </aside>
  )
}

export default ProjectsSidebar