import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'teachtrack:app_settings:v1'

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', nativeLabel: 'English', ready: true },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', ready: false },
  { code: 'fr', label: 'French', nativeLabel: 'Français', ready: false },
]

export function languageLabel(code) {
  return LANGUAGE_OPTIONS.find((o) => o.code === code)?.label ?? 'English'
}

const DEFAULT_NOTIFICATIONS = {
  taskReminders: true,
  gradeUpdates: true,
  classAnnouncements: true,
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      notifications: { ...DEFAULT_NOTIFICATIONS, ...(parsed?.notifications ?? {}) },
      language:
        parsed?.language === 'en' || parsed?.language === 'es' || parsed?.language === 'fr'
          ? parsed.language
          : 'en',
    }
  } catch {
    return null
  }
}

const AppSettingsContext = createContext(null)

export function AppSettingsProvider({ children }) {
  const [state, setState] = useState(
    () => readStored() ?? { notifications: DEFAULT_NOTIFICATIONS, language: 'en' },
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const setNotificationPrefs = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...patch },
    }))
  }, [])

  const setLanguage = useCallback((code) => {
    setState((prev) => ({ ...prev, language: code }))
  }, [])

  const value = useMemo(
    () => ({
      notifications: state.notifications,
      language: state.language,
      setNotificationPrefs,
      setLanguage,
    }),
    [state, setNotificationPrefs, setLanguage],
  )

  return (
    <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
