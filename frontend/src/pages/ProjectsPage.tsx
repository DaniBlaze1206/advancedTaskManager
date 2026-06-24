import { Link } from 'react-router-dom'

function ProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your projects</h1>
        <button
          type="button"
          onClick={() => alert('Create project modal — coming in Phase 2')}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New project
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Real project cards will load from the backend in Phase 2.
      </p>

      {/* Placeholder grid — three fake cards so you can see the layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/projects/demo-1"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300 hover:shadow"
        >
          <h2 className="text-base font-semibold text-slate-900">Demo project 1</h2>
          <p className="mt-1 text-sm text-slate-600">A fake project to test navigation.</p>
        </Link>
        <Link
          to="/projects/demo-2"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300 hover:shadow"
        >
          <h2 className="text-base font-semibold text-slate-900">Demo project 2</h2>
          <p className="mt-1 text-sm text-slate-600">Click me to navigate to the board page.</p>
        </Link>
        <Link
          to="/projects/demo-3"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-300 hover:shadow"
        >
          <h2 className="text-base font-semibold text-slate-900">Demo project 3</h2>
          <p className="mt-1 text-sm text-slate-600">All three lead to the placeholder board.</p>
        </Link>
      </div>
    </div>
  )
}

export default ProjectsPage