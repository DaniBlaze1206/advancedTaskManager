import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import PasswordInput from '../components/ui/PasswordInput'
import Button from '../components/ui/Button'
import { useLogin } from '../hooks/useLogin'

function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const loginMutation = useLogin()

  const canSubmit = identifier.length > 0 && password.length > 0

  function handleSubmit() {
    if (!canSubmit || loginMutation.isPending) return

    loginMutation.mutate(
      { identifier, password },
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
        <h1 className="text-xl font-bold text-slate-900">Log in</h1>

        <div className="mt-4 flex flex-col gap-4">
          <Input
            label="Username or email"
            value={identifier}
            onChange={setIdentifier}
            required
            autoComplete="username"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />

          {loginMutation.error && (
            <p className="text-sm text-red-600">
              {loginMutation.error.message}
            </p>
          )}

          <Button
            disabled={!canSubmit}
            isLoading={loginMutation.isPending}
            onClick={handleSubmit}
          >
            Log in
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage