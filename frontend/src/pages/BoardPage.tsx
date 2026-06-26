import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProject } from '../hooks/useProject'
import PageLoader from '../components/ui/PageLoader'
import Button from '../components/ui/Button'
import Board from '../components/board/Board'
import MembersModal from '../components/members/MembersModal'

function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const projectQuery = useProject(projectId ?? '')
  const [isMembersOpen, setIsMembersOpen] = useState(false)

  if (!projectId) {
    return null
  }

  if (projectQuery.isPending) {
    return <PageLoader />
  }

  if (projectQuery.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-base font-semibold text-slate-900">
          Couldn’t load this project
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          {projectQuery.error.message}
        </p>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => projectQuery.refetch()}
            isLoading={projectQuery.isFetching}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  const project = projectQuery.data

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Projects
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            /
          </span>
          <h1 className="truncate text-xl font-bold text-slate-900">
            {project.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsMembersOpen(true)}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Members ({project.members.length})
        </button>
      </header>

      <div className="min-h-0 flex-1">
        <Board projectId={project._id} lists={project.lists} />
      </div>

      {isMembersOpen && (
  <MembersModal
    project={project}
    onClose={() => setIsMembersOpen(false)}
    onLeave={() => {
      setIsMembersOpen(false)
      navigate('/')
    }}
  />
)}
    </div>
  )
}

export default BoardPage