import { Routes, Route, } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProjectsPage from './pages/ProjectsPage'


function NotFoundPage() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-slate-900">404 - Not Found</h2>
      <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
    </div>
  )
}
import AppShell from './components/layout/AppShell'

function App() {
  return (
    <Routes>
      {/* Auth pages — no app shell, no top bar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated pages — wrapped in the app shell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<ProjectsPage />} />
        <Route
          path="/projects/:projectId"
          element={<BoardPagePlaceholder />}
        />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function BoardPagePlaceholder() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-slate-900">Project board</h2>
      <p className="mt-2 text-sm text-slate-600">
        The Kanban board will live here.
      </p>
    </div>
  )
}

export default App