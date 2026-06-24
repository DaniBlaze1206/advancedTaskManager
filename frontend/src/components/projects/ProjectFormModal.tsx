import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useCreateProject } from '../../hooks/useCreateProject'
import { useUpdateProject } from '../../hooks/useUpdateProject'
import { toast } from '../../lib/toast'
import type { Project } from '../../api/projects'

type ProjectFormModalProps = {
  onClose: () => void
  editingProject?: Project | null
}

function ProjectFormModal({ onClose, editingProject }: ProjectFormModalProps) {
  const isEditMode = editingProject != null

 const [name, setName] = useState(editingProject?.name ?? '')
  const [description, setDescription] = useState(
    editingProject?.description ?? '',
  )

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()

  const activeMutation = isEditMode ? updateMutation : createMutation
  const canSubmit = name.trim().length > 0

  function handleClose() {
    if (activeMutation.isPending) return
    onClose()
  }

  function handleSubmit() {
    if (!canSubmit || activeMutation.isPending) return

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
    }

    if (isEditMode) {
      updateMutation.mutate(
        { projectId: editingProject._id, input: payload },
        {
          onSuccess: () => {
            toast.success('Project updated')
            onClose()
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Project created')
          onClose()
        },
      })
    }
  }

  return (
    <Modal
      open
      onClose={handleClose}
      title={isEditMode ? 'Edit project' : 'New project'}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={activeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            isLoading={activeMutation.isPending}
          >
            {isEditMode ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={setName}
          required
          placeholder="My new project"
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="project-description"
            className="text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What is this project for?"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
          />
        </div>

        {activeMutation.error && (
          <p className="text-sm text-red-600">
            {activeMutation.error.message}
          </p>
        )}
      </div>
    </Modal>
  )
}

export default ProjectFormModal