import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../../api/projects'

type ProjectCardProps = {
  project: Project
  isOwner: boolean
  onEdit: (project: Project) => void
}

function ProjectCard({ project, isOwner, onEdit }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close the menu when clicking outside it.
  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function handleMenuButtonClick(event: React.MouseEvent) {
    // Prevent the click from bubbling up to the wrapping <Link>.
    event.preventDefault()
    event.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  function handleEditClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setMenuOpen(false)
    onEdit(project)
  }

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group relative flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow"
    >
      {isOwner && (
        <div ref={menuRef} className="absolute right-2 top-2">
          <button
            type="button"
            onClick={handleMenuButtonClick}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Project actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            ⋮
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleEditClick}
                className="block w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100"
              >
                Rename
              </button>
            </div>
          )}
        </div>
      )}

      <h2 className="pr-8 text-base font-semibold text-slate-900 group-hover:text-brand-600">
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