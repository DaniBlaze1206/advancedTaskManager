import type { List } from '../../api/lists'
import Column from './Column'
import AddColumn from './AddColumn'

type BoardProps = {
  projectId: string
  lists: List[]
}

function Board({ projectId, lists }: BoardProps) {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2">
      {lists.map((list) => (
        <Column key={list._id} list={list} projectId={projectId} />
      ))}
      <AddColumn projectId={projectId} />
    </div>
  )
}

export default Board