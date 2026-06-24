import { useState } from 'react'
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from '../api/client'
import type { User } from '../api/auth'
import {
  AuthContext,
  type AuthContextValue,
  type AuthSession,
} from './authContext'

const USER_STORAGE_KEY = 'atm.user'

function readStoredSession(): AuthSession | null {
  const token = getStoredToken()
  const userRaw = localStorage.getItem(USER_STORAGE_KEY)
  if (!token || !userRaw) return null

  try {
    const user = JSON.parse(userRaw) as User
    return { token, user }
  } catch {
    // Stored user got corrupted somehow — wipe so we don't keep failing.
    clearStoredToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function persistSession(session: AuthSession): void {
  setStoredToken(session.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
}

function clearPersistedSession(): void {
  clearStoredToken()
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer — reads localStorage ONCE on first render.
  // No useEffect, no isInitializing flag.
  const [session, setSession] = useState<AuthSession | null>(readStoredSession)

  function login(next: AuthSession): void {
    persistSession(next)
    setSession(next)
  }

  function logout(): void {
    clearPersistedSession()
    setSession(null)
  }

  const value: AuthContextValue = {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}