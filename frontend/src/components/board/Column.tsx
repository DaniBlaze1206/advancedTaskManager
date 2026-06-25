import type { List } from '../../api/lists'
import TaskCard from './TaskCard'

type ColumnProps = {
  list: List
}

function Column({ list }: ColumnProps) {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-lg bg-slate-100 p-3">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{list.name}</h2>
        <span className="text-xs text-slate-500">{list.tasks.length}</span>
      </header>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {list.tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
            No tasks yet
          </p>
        ) : (
          list.tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  )
}

export default Column