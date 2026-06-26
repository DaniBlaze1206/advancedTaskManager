import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useUpdateTask } from '../../hooks/useUpdateTask'
import { useDeleteTask } from '../../hooks/useDeleteTask'
import { toast } from '../../lib/toast'
import type { Task } from '../../api/tasks'

type TaskDetailModalProps = {
  task: Task
  projectId: string
  onClose: () => void
}

function TaskDetailModal({ task, projectId, onClose }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDescription, setDraftDescription] = useState(
    task.description ?? '',
  )
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  function startEditing() {
    setDraftTitle(task.title)
    setDraftDescription(task.description ?? '')
    setIsEditing(true)
    updateMutation.reset()
  }

  function cancelEditing() {
    setIsEditing(false)
    setDraftTitle(task.title)
    setDraftDescription(task.description ?? '')
    updateMutation.reset()
  }

  function handleSave() {
    const trimmedTitle = draftTitle.trim()
    if (trimmedTitle.length === 0 || updateMutation.isPending) return

    updateMutation.mutate(
      {
        projectId,
        listId: task.list,
        taskId: task._id,
        input: {
          title: trimmedTitle,
          description: draftDescription.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Task updated')
          onClose()
        },
      },
    )
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(
      { projectId, listId: task.list, taskId: task._id },
      {
        onSuccess: () => {
          toast.success('Task deleted')
          setIsConfirmingDelete(false)
          onClose()
        },
        onError: (error) => {
          toast.error(error.message)
          setIsConfirmingDelete(false)
        },
      },
    )
  }

  return (
    <>
      <Modal
        open
        onClose={() => {
          if (updateMutation.isPending || deleteMutation.isPending) return
          onClose()
        }}
        title={
          isEditing ? (
            'Edit task'
          ) : (
            <span className="break-words">{task.title}</span>
          )
        }
        footer={
          isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={cancelEditing}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                isLoading={updateMutation.isPending}
                disabled={draftTitle.trim().length === 0}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </Button>
              <Button onClick={startEditing}>Edit</Button>
            </>
          )
        }
      >
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="task-title"
                className="block text-xs font-semibold text-slate-700"
              >
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                disabled={updateMutation.isPending}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="block text-xs font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                disabled={updateMutation.isPending}
                rows={5}
                className="mt-1 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>

            {updateMutation.error && (
              <p className="text-sm text-red-600">
                {updateMutation.error.message}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {task.description ? (
              <p className="whitespace-pre-wrap break-words text-sm text-slate-700">
                {task.description}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                No description.
              </p>
            )}
          </div>
        )}
      </Modal>

      {isConfirmingDelete && (
        <ConfirmDialog
          open
          title="Delete this task?"
          description={
            <>
              <p>
                You’re about to delete{' '}
                <strong className="font-semibold text-slate-900">
                  {task.title}
                </strong>
                .
              </p>
              <p className="mt-2">This action can’t be undone.</p>
            </>
          }
          confirmLabel="Delete task"
          variant="destructive"
          isPending={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </>
  )
}

export default TaskDetailModal