import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function AppShell() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-6">
          <Link to="/" className="text-base font-bold text-slate-900">
            Task Manager
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }
            >
              Projects
            </NavLink>

            {session && (
              <span className="text-slate-500">@{session.user.username}</span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell