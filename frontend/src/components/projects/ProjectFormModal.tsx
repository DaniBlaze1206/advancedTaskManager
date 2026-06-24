import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useCreateProject } from '../../hooks/useCreateProject'
import { toast } from '../../lib/toast'

type ProjectFormModalProps = {
  open: boolean
  onClose: () => void
}

function ProjectFormModal({ open, onClose }: ProjectFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createMutation = useCreateProject()

  const canSubmit = name.trim().length > 0

  function handleClose() {
    if (createMutation.isPending) return
    setName('')
    setDescription('')
    createMutation.reset()
    onClose()
  }

  function handleSubmit() {
    if (!canSubmit || createMutation.isPending) return

    createMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Project created')
          handleClose()
        },
      },
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New project"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            isLoading={createMutation.isPending}
          >
            Create project
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

        {createMutation.error && (
          <p className="text-sm text-red-600">
            {createMutation.error.message}
          </p>
        )}
      </div>
    </Modal>
  )
}

export default ProjectFormModal