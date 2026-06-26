import { useState } from 'react'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useRemoveMember } from '../../hooks/useRemoveMember'
import { toast } from '../../lib/toast'
import type { User } from '../../api/projects'

type MemberRowProps = {
  member: User
  projectId: string
  isOwner: boolean
  isCurrentUser: boolean
  canManageMembers: boolean
  onLeaveSuccess: () => void
}

function MemberRow({
  member,
  projectId,
  isOwner,
  isCurrentUser,
  canManageMembers,
  onLeaveSuccess,
}: MemberRowProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const removeMutation = useRemoveMember()

  // The owner can remove non-owner members.
  const canRemove = canManageMembers && !isOwner && !isCurrentUser

  // A member (not the owner) can leave the project (their own row).
  const canLeave = isCurrentUser && !isOwner

  // Show a button if either action is available.
  const action: 'remove' | 'leave' | null = canRemove
    ? 'remove'
    : canLeave
      ? 'leave'
      : null

  function handleConfirm() {
    removeMutation.mutate(
      { projectId, userId: member._id },
      {
        onSuccess: () => {
          if (action === 'leave') {
            toast.success('Left the project')
            // The parent navigates away — see MembersModal.
            onLeaveSuccess()
          } else {
            toast.success(`Removed ${member.username}`)
            setIsConfirming(false)
          }
        },
        onError: (error) => {
          toast.error(error.message)
          setIsConfirming(false)
        },
      },
    )
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">
              {member.username}
            </p>
            {isOwner && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                Owner
              </span>
            )}
            {isCurrentUser && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                You
              </span>
            )}
          </div>
          <p className="truncate text-xs text-slate-500">{member.email}</p>
        </div>

        {action && (
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            {action === 'leave' ? 'Leave project' : 'Remove'}
          </button>
        )}
      </div>

      {isConfirming && (
        <ConfirmDialog
          open
          title={
            action === 'leave' ? 'Leave this project?' : 'Remove this member?'
          }
          description={
            action === 'leave' ? (
              <p>
                You’ll lose access to this project. You can rejoin if the owner
                adds you back.
              </p>
            ) : (
              <p>
                Remove{' '}
                <strong className="font-semibold text-slate-900">
                  {member.username}
                </strong>{' '}
                from this project? They’ll lose access to all lists and tasks.
              </p>
            )
          }
          confirmLabel={action === 'leave' ? 'Leave' : 'Remove'}
          variant="destructive"
          isPending={removeMutation.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </>
  )
}

export default MemberRow