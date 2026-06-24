import { useMutation } from '@tanstack/react-query'
import {
  register,
  type RegisterInput,
  type AuthResponse,
} from '../api/auth'
import { useAuth } from './useAuth'

export function useRegister() {
  const { login: signIn } = useAuth()

  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: register,
    onSuccess: (data) => {
      signIn({ token: data.token, user: data.user })
    },
  })
}