import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'teachtrack:user_profile:v1'

/**
 * Rich teacher profile, mirroring PulseBox UserContext.
 *
 * Fields: displayName, avatarUri, email, phone, country, city, address,
 *         institutionName, professionalTitle, subjectsTeach
 *
 * Source of truth precedence:
 *   1. Stored profile (localStorage)
 *   2. AuthContext.user (display name + email coming from sign-up / login)
 */

function defaultProfile() {
  return {
    displayName: '',
    avatarUri: null,
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    institutionName: '',
    professionalTitle: '',
    subjectsTeach: '',
  }
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return { ...defaultProfile(), ...parsed }
    }
    return null
  } catch {
    return null
  }
}

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(() => readStored() ?? defaultProfile())

  // Hydrate empty fields from auth on first login.
  useEffect(() => {
    if (!user) return
    setProfile((prev) => {
      const next = { ...prev }
      if (!next.displayName && user.name) next.displayName = user.name
      if (!next.email && user.email) next.email = user.email
      return next
    })
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // ignore
    }
  }, [profile])

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const setDisplayName = useCallback(
    (name) => {
      updateProfile({ displayName: name.trim() })
    },
    [updateProfile],
  )

  const firstName = useMemo(() => {
    const n = (profile.displayName ?? '').trim()
    if (!n) return ''
    return n.split(/\s+/)[0]
  }, [profile.displayName])

  const initials = useMemo(() => {
    const n = (profile.displayName ?? '').trim()
    if (!n) return 'TT'
    return n
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
  }, [profile.displayName])

  const value = useMemo(
    () => ({
      profile,
      displayName: profile.displayName,
      firstName,
      initials,
      updateProfile,
      setDisplayName,
    }),
    [profile, firstName, initials, updateProfile, setDisplayName],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
