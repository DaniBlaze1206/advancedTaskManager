import { Outlet } from 'react-router-dom'
import ProjectsSidebar from './ProjectSidebar'

function BoardLayout() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] -mx-6 -my-6">
      <ProjectsSidebar />
      <main className="min-w-0 flex-1 overflow-hidden p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default BoardLayout