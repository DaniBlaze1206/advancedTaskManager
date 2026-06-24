import { useState } from 'react'
import Input from './Input'

type PasswordInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  autoComplete?: string
}

function PasswordInput({
  label,
  value,
  onChange,
  error,
  required,
  autoComplete,
}: PasswordInputProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <Input
      label={label}
      value={value}
      onChange={onChange}
      type={revealed ? 'text' : 'password'}
      error={error}
      required={required}
      autoComplete={autoComplete}
      rightAdornment={
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="rounded p-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={revealed ? 'Hide password' : 'Show password'}
        >
          {revealed ? 'Hide' : 'Show'}
        </button>
      }
    />
  )
}

export default PasswordInput