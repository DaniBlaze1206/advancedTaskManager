import type { List } from '../../api/lists'
import Column from './Column'

type BoardProps = {
  lists: List[]
}

function Board({ lists }: BoardProps) {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2">
      {lists.map((list) => (
        <Column key={list._id} list={list} />
      ))}
    </div>
  )
}

export default Board