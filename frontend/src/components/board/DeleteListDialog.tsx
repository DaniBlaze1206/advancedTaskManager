import ConfirmDialog from '../ui/ConfirmDialog'
import { useDeleteList } from '../../hooks/useDeleteList'
import { toast } from '../../lib/toast'
import type { List } from '../../api/lists'

type DeleteListDialogProps = {
  list: List
  projectId: string
  onClose: () => void
}

function DeleteListDialog({
  list,
  projectId,
  onClose,
}: DeleteListDialogProps) {
  const deleteMutation = useDeleteList()

  function handleConfirm() {
    deleteMutation.mutate(
      { projectId, listId: list._id },
      {
        onSuccess: () => {
          toast.success('Column deleted')
          onClose()
        },
        onError: (error) => {
          toast.error(error.message)
          onClose()
        },
      },
    )
  }

  const taskCount = list.tasks.length

  return (
    <ConfirmDialog
      open
      title="Delete this column?"
      description={
        <>
          <p>
            You’re about to delete{' '}
            <strong className="font-semibold text-slate-900">
              {list.name}
            </strong>
            .
          </p>
          {taskCount > 0 ? (
            <p className="mt-2">
              This will also delete{' '}
              <strong>
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </strong>{' '}
              inside it. This action can’t be undone.
            </p>
          ) : (
            <p className="mt-2">This action can’t be undone.</p>
          )}
        </>
      }
      confirmLabel="Delete column"
      variant="destructive"
      isPending={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}

export default DeleteListDialog