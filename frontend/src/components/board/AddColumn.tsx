import { useEffect, useRef, useState } from "react";
import { useCreateList } from "../../hooks/useCreateList";
import { toast } from "../../lib/toast";

type AddColumnProps = {
  projectId: string;
};

function AddColumn({ projectId }: AddColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const createMutation = useCreateList();

  // When entering edit mode, focus the input so the user can just start typing.
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setName("");
    createMutation.reset();
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (trimmed.length === 0 || createMutation.isPending) return;

    createMutation.mutate(
      { projectId, input: { name: trimmed } },
      {
        onSuccess: () => {
          toast.success("Column added");
          cancelEditing();
        },
      },
    );
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === "Escape") {
      cancelEditing();
    }
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="flex h-12 w-80 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/50 text-sm font-medium text-slate-600 hover:border-brand-300 hover:bg-white hover:text-brand-700"
      >
        + Add column
      </button>
    );
  }

  return (
    <div className="flex w-80 shrink-0 flex-col gap-2 rounded-lg bg-slate-100 p-3">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Column name"
        disabled={createMutation.isPending}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      />

      {createMutation.error && (
        <p className="text-xs text-red-600">{createMutation.error.message}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={name.trim().length === 0 || createMutation.isPending}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending ? "Adding…" : "Add column"}
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
  );
}

export default AddColumn;
