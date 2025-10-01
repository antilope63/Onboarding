"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type UserRole = "manager" | "rh" | "user"

interface AuthState {
  email: string | null
  role: UserRole
}

interface AuthContextValue {
  auth: AuthState
  setAuth: (next: AuthState) => void
  updateRole: (role: UserRole) => void
  clearAuth: () => void
}

const AUTH_STORAGE_KEY = "pixelplay:auth"
const DEFAULT_AUTH_STATE: AuthState = { email: null, role: "user" }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readAuthFromStorage(): AuthState {
  if (typeof window === "undefined") {
    return DEFAULT_AUTH_STATE
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return DEFAULT_AUTH_STATE

    const parsed = JSON.parse(raw) as Partial<AuthState>
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_AUTH_STATE
    }

    const email = typeof parsed.email === "string" ? parsed.email : null
    const role = parsed.role === "manager" || parsed.role === "rh" ? parsed.role : "user"

    return { email, role }
  } catch (error) {
    console.error("AuthContext: Failed to read localStorage", error)
    return DEFAULT_AUTH_STATE
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE)

  useEffect(() => {
    setAuthState(readAuthFromStorage())
  }, [])

  const persist = useCallback((next: AuthState) => {
    setAuthState(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    }
  }, [])

  const setAuth = useCallback(
    (next: AuthState) => {
      persist(next)
    },
    [persist]
  )

  const updateRole = useCallback(
    (role: UserRole) => {
      persist({ email: auth.email, role })
    },
    [auth.email, persist]
  )

  const clearAuth = useCallback(() => {
    setAuthState(DEFAULT_AUTH_STATE)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ auth, setAuth, updateRole, clearAuth }),
    [auth, setAuth, updateRole, clearAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  const { auth, setAuth, updateRole, clearAuth } = context

  return {
    email: auth.email,
    role: auth.role,
    isManager: auth.role === "manager",
    isRh: auth.role === "rh",
    isUser: auth.role === "user",
    setAuth,
    updateRole,
    clearAuth,
  }
}

export { AUTH_STORAGE_KEY }
