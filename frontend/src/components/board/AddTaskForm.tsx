import { useEffect, useRef, useState } from 'react'
import { useCreateTask } from '../../hooks/useCreateTask'
import { toast } from '../../lib/toast'

type AddTaskFormProps = {
  projectId: string
  listId: string
}

function AddTaskForm({ projectId, listId }: AddTaskFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const createMutation = useCreateTask()

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  function startEditing() {
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setTitle('')
    createMutation.reset()
  }

  function handleSubmit() {
    const trimmed = title.trim()
    if (trimmed.length === 0 || createMutation.isPending) return

    createMutation.mutate(
      { projectId, listId, input: { title: trimmed } },
      {
        onSuccess: () => {
          toast.success('Task added')
          cancelEditing()
        },
      },
    )
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    } else if (event.key === 'Escape') {
      cancelEditing()
    }
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 bg-white/50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-white hover:text-brand-700"
      >
        + Add task
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-brand-300 bg-white p-2">
      <textarea
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs doing?"
        disabled={createMutation.isPending}
        rows={2}
        className="w-full resize-none rounded border border-slate-200 px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      />

      {createMutation.error && (
        <p className="text-xs text-red-600">{createMutation.error.message}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={title.trim().length === 0 || createMutation.isPending}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending ? 'Adding…' : 'Add task'}
        </button>
        <button
          type="button"
          onClick={cancelEditing}
          disabled={createMutation.isPending}
          className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default AddTaskForm