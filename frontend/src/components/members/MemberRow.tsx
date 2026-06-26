import type { User } from '../../api/projects'

type MemberRowProps = {
  member: User
  isOwner: boolean
  isCurrentUser: boolean
}

function MemberRow({ member, isOwner, isCurrentUser }: MemberRowProps) {
  return (
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
    </div>
  )
}

export default MemberRow