import { createContext } from 'react'
import type { User } from '../api/auth'

export type AuthSession = {
  token: string
  user: User
}

export type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)