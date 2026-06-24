import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'
import { useRegister } from '../hooks/useRegister'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const registerMutation = useRegister()

  const passwordsMatch = password === confirmPassword
  const allFilled =
    username.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0
  const canSubmit = allFilled && passwordsMatch

  const confirmError =
    confirmPassword.length > 0 && !passwordsMatch
      ? "Passwords don't match"
      : undefined

  function handleSubmit() {
    if (!canSubmit || registerMutation.isPending) return

    registerMutation.mutate(
      { username, email, password, confirmPassword },
      {
        onSuccess: () => {
          navigate('/', { replace: true })
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="text-xl font-bold text-slate-900">Create an account</h1>

        <div className="mt-4 flex flex-col gap-4">
          <Input
            label="Username"
            value={username}
            onChange={setUsername}
            required
            autoComplete="username"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
            error={confirmError}
          />

          {registerMutation.error && (
            <p className="text-sm text-red-600">
              {registerMutation.error.message}
            </p>
          )}

          <Button
            disabled={!canSubmit}
            isLoading={registerMutation.isPending}
            onClick={handleSubmit}
          >
            Create account
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage