import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useCreateProject } from '../../hooks/useCreateProject'
import { useUpdateProject } from '../../hooks/useUpdateProject'
import { lookupUserByUsername } from '../../api/users'
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
  const [memberInput, setMemberInput] = useState('')
  const [memberChips, setMemberChips] = useState<string[]>([])
  const [memberError, setMemberError] = useState<string | null>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()

  const activeMutation = isEditMode ? updateMutation : createMutation
  const canSubmit = name.trim().length > 0

  async function commitChip() {
    const trimmed = memberInput.trim()
    if (trimmed.length === 0 || isLookingUp) return

    if (memberChips.includes(trimmed)) {
      setMemberInput('')
      setMemberError(null)
      return
    }

    setIsLookingUp(true)
    setMemberError(null)
    try {
      const user = await lookupUserByUsername(trimmed)
      setMemberChips([...memberChips, user.username])
      setMemberInput('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not find user'
      setMemberError(message)
    } finally {
      setIsLookingUp(false)
    }
  }

  function removeChip(username: string) {
    setMemberChips(memberChips.filter((chip) => chip !== username))
  }

  function handleMemberKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitChip()
    }
  }

  function handleMemberInputChange(value: string) {
    setMemberInput(value)
    if (memberError) setMemberError(null)
  }

  function handleClose() {
    if (activeMutation.isPending) return
    onClose()
  }

  function handleSubmit() {
    if (!canSubmit || activeMutation.isPending) return

    if (isEditMode) {
      updateMutation.mutate(
        {
          projectId: editingProject._id,
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success('Project updated')
            onClose()
          },
        },
      )
    } else {
      createMutation.mutate(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          members: memberChips.length > 0 ? memberChips : undefined,
        },
        {
          onSuccess: () => {
            toast.success('Project created')
            onClose()
          },
        },
      )
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

        {!isEditMode && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="project-members"
              className="text-sm font-medium text-slate-700"
            >
              Members{' '}
              <span className="text-xs font-normal text-slate-500">
                (optional)
              </span>
            </label>

            <div className="flex items-stretch gap-2">
              <input
                id="project-members"
                type="text"
                value={memberInput}
                onChange={(e) => handleMemberInputChange(e.target.value)}
                onKeyDown={handleMemberKeyDown}
                placeholder="Username, press Enter to add"
                disabled={activeMutation.isPending || isLookingUp}
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
              />
              <Button
                variant="secondary"
                onClick={commitChip}
                isLoading={isLookingUp}
                disabled={
                  memberInput.trim().length === 0 || activeMutation.isPending
                }
              >
                Add
              </Button>
            </div>

            {memberError && (
              <p className="text-xs text-red-600">{memberError}</p>
            )}

            {memberChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {memberChips.map((username) => (
                  <span
                    key={username}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700"
                  >
                    {username}
                    <button
                      type="button"
                      onClick={() => removeChip(username)}
                      disabled={activeMutation.isPending}
                      className="text-brand-500 hover:text-brand-900 disabled:cursor-not-allowed"
                      aria-label={`Remove ${username}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

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