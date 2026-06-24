type EmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/40 p-8 text-center">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-600">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState