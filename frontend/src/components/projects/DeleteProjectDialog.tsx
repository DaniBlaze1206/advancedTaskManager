import ConfirmDialog from '../ui/ConfirmDialog'
import { useDeleteProject } from '../../hooks/useDeleteProjects'
import { toast } from '../../lib/toast'
import type { Project } from '../../api/projects'

type DeleteProjectDialogProps = {
  project: Project
  onClose: () => void
}

function DeleteProjectDialog({ project, onClose }: DeleteProjectDialogProps) {
  const deleteMutation = useDeleteProject()

  function handleConfirm() {
    deleteMutation.mutate(project._id, {
      onSuccess: () => {
        toast.success('Project deleted')
        onClose()
      },
      onError: (error) => {
        toast.error(error.message)
        onClose()
      },
    })
  }

  return (
    <ConfirmDialog
      open
      title="Delete this project?"
      description={
        <>
          <p>
            You’re about to permanently delete{' '}
            <strong className="font-semibold text-slate-900">
              {project.name}
            </strong>
            .
          </p>
          <p className="mt-2">
            This will also delete all of its lists and tasks. This action can’t
            be undone.
          </p>
        </>
      }
      confirmLabel="Delete project"
      variant="destructive"
      isPending={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  )
}

export default DeleteProjectDialog