import { useState } from 'react'
import type { List } from '../../api/lists'
import ColumnHeader from './ColumnHeader'
import DeleteListDialog from './DeleteListDialog'
import TaskCard from './TaskCard'

type ColumnProps = {
  list: List
  projectId: string
}

function Column({ list, projectId }: ColumnProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-lg bg-slate-100 p-3">
      <ColumnHeader
        list={list}
        projectId={projectId}
        onRequestDelete={() => setIsDeleting(true)}
      />

      <div className="flex flex-col gap-2 overflow-y-auto">
        {list.tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500">
            No tasks yet
          </p>
        ) : (
          list.tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>

      {isDeleting && (
        <DeleteListDialog
          list={list}
          projectId={projectId}
          onClose={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

export default Column