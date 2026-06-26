import { useEffect, useRef, useState } from 'react'
import { useUpdateList } from '../../hooks/useUpdateList'
import { toast } from '../../lib/toast'
import type { List } from '../../api/lists'

type ColumnHeaderProps = {
  list: List
  projectId: string
  onRequestDelete: () => void
}

function ColumnHeader({
  list,
  projectId,
  onRequestDelete,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(list.name)
  const [menuOpen, setMenuOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const updateMutation = useUpdateList()

  // Focus the input when entering edit mode.
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  // Close the menu when clicking outside.
  useEffect(() => {
    if (!menuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function startEditing() {
    setDraftName(list.name)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setDraftName(list.name)
    updateMutation.reset()
  }

  function commitEdit() {
    const trimmed = draftName.trim()

    // No change, or empty → just exit edit mode, don't save.
    if (trimmed.length === 0 || trimmed === list.name) {
      cancelEditing()
      return
    }

    updateMutation.mutate(
      { projectId, listId: list._id, input: { name: trimmed } },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitEdit()
    } else if (event.key === 'Escape') {
      cancelEditing()
    }
  }

  function handleDeleteClick() {
    setMenuOpen(false)
    onRequestDelete()
  }

  if (isEditing) {
    return (
      <div className="mb-3">
        <input
          ref={inputRef}
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          disabled={updateMutation.isPending}
          className="w-full rounded-md border border-brand-300 bg-white px-2 py-1 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </div>
    )
  }

  return (
    <header className="mb-3 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={startEditing}
        className="flex-1 truncate rounded px-2 py-1 text-left text-sm font-semibold text-slate-900 hover:bg-slate-200"
      >
        {list.name}
      </button>

      <span className="shrink-0 text-xs text-slate-500">
        {list.tasks.length}
      </span>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Column actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleDeleteClick}
              className="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default ColumnHeader