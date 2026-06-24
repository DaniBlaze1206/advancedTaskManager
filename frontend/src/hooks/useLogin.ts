import { useMutation } from '@tanstack/react-query'
import { login, type LoginInput, type AuthResponse } from '../api/auth'
import { useAuth } from './useAuth'

export function useLogin() {
  const { login: signIn } = useAuth()

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: login,
    onSuccess: (data) => {
      signIn({ token: data.token, user: data.user })
    },
  })
}