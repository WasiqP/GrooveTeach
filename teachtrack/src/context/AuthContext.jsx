import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'teachtrack:auth'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.email) return parsed
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      login: (data) => setUser({ name: 'Teacher', ...data }),
      signUp: (data) => setUser({ name: 'Teacher', ...data }),
      logout: () => setUser(null),
      updateProfile: (patch) => setUser((u) => (u ? { ...u, ...patch } : u)),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
