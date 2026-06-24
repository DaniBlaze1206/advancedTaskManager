import { apiClient } from './client'

export type User = {
  _id: string
  username: string
  email: string
}

export type AuthResponse = {
  message: string
  token: string
  user: User
}

export type RegisterInput = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginInput = {
  identifier: string
  password: string
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/signIn', input)
  return data
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', input)
  return data
}