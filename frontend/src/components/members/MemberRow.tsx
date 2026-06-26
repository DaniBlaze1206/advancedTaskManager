import { useState } from 'react'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useRemoveMember } from '../../hooks/useRemoveMember'
import { useTransferOwnership } from '../../hooks/useTransferOwnership'
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

type ConfirmAction = 'remove' | 'leave' | 'transfer' | null

function MemberRow({
  member,
  projectId,
  isOwner,
  isCurrentUser,
  canManageMembers,
  onLeaveSuccess,
}: MemberRowProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const removeMutation = useRemoveMember()
  const transferMutation = useTransferOwnership()

  const canRemove = canManageMembers && !isOwner && !isCurrentUser

  const canTransfer = canManageMembers && !isOwner && !isCurrentUser

  const canLeave = isCurrentUser && !isOwner

  const activeMutation =
    confirmAction === 'transfer' ? transferMutation : removeMutation

  function handleConfirm() {
    if (confirmAction === 'transfer') {
      transferMutation.mutate(
        { projectId, newOwnerId: member._id },
        {
          onSuccess: () => {
            toast.success(`Ownership transferred to ${member.username}`)
            setConfirmAction(null)
          },
          onError: (error) => {
            toast.error(error.message)
            setConfirmAction(null)
          },
        },
      )
    } else {
      removeMutation.mutate(
        { projectId, userId: member._id },
        {
          onSuccess: () => {
            if (confirmAction === 'leave') {
              toast.success('Left the project')
              onLeaveSuccess()
            } else {
              toast.success(`Removed ${member.username}`)
              setConfirmAction(null)
            }
          },
          onError: (error) => {
            toast.error(error.message)
            setConfirmAction(null)
          },
        },
      )
    }
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

        <div className="flex shrink-0 items-center gap-1">
          {canTransfer && (
            <button
              type="button"
              onClick={() => setConfirmAction('transfer')}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Make owner
            </button>
          )}
          {canRemove && (
            <button
              type="button"
              onClick={() => setConfirmAction('remove')}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
          {canLeave && (
            <button
              type="button"
              onClick={() => setConfirmAction('leave')}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Leave project
            </button>
          )}
        </div>
      </div>

      {confirmAction !== null && (
        <ConfirmDialog
          open
          title={
            confirmAction === 'transfer'
              ? 'Transfer ownership?'
              : confirmAction === 'leave'
                ? 'Leave this project?'
                : 'Remove this member?'
          }
          description={
            confirmAction === 'transfer' ? (
              <>
                <p>
                  You’ll transfer ownership of this project to{' '}
                  <strong className="font-semibold text-slate-900">
                    {member.username}
                  </strong>
                  .
                </p>
                <p className="mt-2">
                  You’ll become a regular member and lose the ability to manage
                  members, edit project settings, or delete the project. This
                  can only be undone if the new owner transfers it back to you.
                </p>
              </>
            ) : confirmAction === 'leave' ? (
              <p>
                You’ll lose access to this project. You can rejoin if the
                owner adds you back.
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
          confirmLabel={
            confirmAction === 'transfer'
              ? 'Transfer ownership'
              : confirmAction === 'leave'
                ? 'Leave'
                : 'Remove'
          }
          variant={confirmAction === 'transfer' ? 'primary' : 'destructive'}
          isPending={activeMutation.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  )
}

export default MemberRow