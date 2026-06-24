import { Link } from 'react-router-dom'
import type { Project } from '../../api/projects'

type ProjectCardProps = {
  project: Project
  isOwner: boolean
}

function ProjectCard({ project, isOwner }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow"
    >
      <h2 className="text-base font-semibold text-slate-900 group-hover:text-brand-600">
        {project.name}
      </h2>

      {project.description && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>
          {project.members.length}{' '}
          {project.members.length === 1 ? 'member' : 'members'}
        </span>

        {isOwner && (
          <>
            <span aria-hidden="true">•</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 font-semibold text-brand-700">
              Owner
            </span>
          </>
        )}
      </div>
    </Link>
  )
}

export default ProjectCard