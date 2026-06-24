type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  error?: string
  required?: boolean
  autoComplete?: string
  id?: string
  rightAdornment?: React.ReactNode
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  autoComplete,
  id,
  rightAdornment,
}: InputProps) {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`

  // We have to know whether to reserve padding on the right for the adornment.
  const hasAdornment = rightAdornment !== undefined

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
            hasAdornment ? 'pr-10' : ''
          } ${
            error
              ? 'border-red-500 focus-visible:ring-red-400'
              : 'border-slate-300 focus-visible:ring-brand-500'
          }`}
        />

        {hasAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {rightAdornment}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input