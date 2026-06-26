import { useState } from 'react'
import type { List } from '../../api/lists'
import type { Task } from '../../api/tasks'
import ColumnHeader from './ColumnHeader'
import DeleteListDialog from './DeleteListDialog'
import TaskCard from './TaskCard'
import AddTaskForm from './AddTaskForm'
import TaskDetailModal from './TaskDetailModal'

type ColumnProps = {
  list: List
  projectId: string
}

function Column({ list, projectId }: ColumnProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [openTask, setOpenTask] = useState<Task | null>(null)

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-lg bg-slate-100 p-3">
      <ColumnHeader
        list={list}
        projectId={projectId}
        onRequestDelete={() => setIsDeleting(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {list.tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => setOpenTask(task)}
          />
        ))}
        <AddTaskForm projectId={projectId} listId={list._id} />
      </div>

      {isDeleting && (
        <DeleteListDialog
          list={list}
          projectId={projectId}
          onClose={() => setIsDeleting(false)}
        />
      )}

      {openTask && (
        <TaskDetailModal
          task={openTask}
          projectId={projectId}
          onClose={() => setOpenTask(null)}
        />
      )}
    </div>
  )
}

export default Column