import { useMemo } from 'react'
import Modal from '../ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import MemberRow from './MemberRow'
import type { ProjectDetail } from '../../api/projects'

type MembersModalProps = {
  project: ProjectDetail
  onClose: () => void
}

function MembersModal({ project, onClose }: MembersModalProps) {
  const { session } = useAuth()
  const currentUserId = session?.user._id

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
      <div className="flex flex-col gap-1">
        {orderedMembers.map((member) => (
          <MemberRow
            key={member._id}
            member={member}
            isOwner={member._id === project.owner._id}
            isCurrentUser={member._id === currentUserId}
          />
        ))}
      </div>
    </Modal>
  )
}

export default MembersModal