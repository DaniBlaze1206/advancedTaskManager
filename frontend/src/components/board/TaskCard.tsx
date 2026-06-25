import type { Task } from '../../api/tasks'

type TaskCardProps = {
  task: Task
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="cursor-pointer rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-brand-300 hover:bg-slate-50">
      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
      {task.description && (
        <p className="mt-1 line-clamp-1 text-xs text-slate-600">
          {task.description}
        </p>
      )}
    </div>
  )
}

export default TaskCard