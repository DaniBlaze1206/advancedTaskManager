import { useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useAddMember } from '../../hooks/useAddMember'
import { toast } from '../../lib/toast'
import MemberRow from './MemberRow'
import type { ProjectDetail } from '../../api/projects'

function MembersModal({
  project,
  onClose,
}: {
  project: ProjectDetail
  onClose: () => void
}) {
  const { session } = useAuth()

  const sessionUser = session?.user as
    | { _id?: string; id?: string }
    | undefined
  const currentUserId = sessionUser?._id ?? sessionUser?.id

  const isOwner = !!currentUserId && project.owner._id === currentUserId

  const [username, setUsername] = useState('')
  const addMutation = useAddMember()

  function handleAddSubmit() {
    const trimmed = username.trim()
    if (trimmed.length === 0 || addMutation.isPending) return

    addMutation.mutate(
      { projectId: project._id, username: trimmed },
      {
        onSuccess: () => {
          toast.success(`Added ${trimmed}`)
          setUsername('')
        },
      },
    )
  }

  function handleAddKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddSubmit()
    }
  }

  const orderedMembers = useMemo(() => {
    const ownerId = project.owner._id
    const owner = project.members.find((m) => m._id === ownerId)
    const others = project.members.filter((m) => m._id !== ownerId)
    return owner ? [owner, ...others] : [project.owner, ...others]
  }, [project.owner, project.members])

  return (
    <Modal
      open
      onClose={onClose}
      title={`Members (${project.members.length})`}
    >
      <div className="flex flex-col gap-4">
        {isOwner && (
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Add member
            </p>
            <div className="flex items-stretch gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleAddKeyDown}
                placeholder="Username"
                disabled={addMutation.isPending}
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
              />
              <Button
                onClick={handleAddSubmit}
                isLoading={addMutation.isPending}
                disabled={username.trim().length === 0}
              >
                Add
              </Button>
            </div>
            {addMutation.error && (
              <p className="text-xs text-red-600">
                {addMutation.error.message}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {orderedMembers.map((member) => (
            <MemberRow
              key={member._id}
              member={member}
              isOwner={member._id === project.owner._id}
              isCurrentUser={!!currentUserId && member._id === currentUserId}
            />
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default MembersModal