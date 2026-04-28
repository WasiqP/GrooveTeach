import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'teachtrack:forms:v1'

/**
 * Form shape:
 *   id, name, iconId, answers: { taskKind, classId, focusTopic, duePreset, formatIds, questions: [QuestionData] },
 *   createdAt
 *
 * Question types: shortText | longText | multipleChoice | checkbox | dropdown | rating | email | number | date
 */

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

const FormsContext = createContext(null)

export function FormsProvider({ children }) {
  const [forms, setForms] = useState(() => readStored() ?? [])
  const [isLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
    } catch {
      // ignore
    }
  }, [forms])

  const addForm = useCallback((form) => {
    setForms((prev) => [form, ...prev])
  }, [])

  const updateForm = useCallback((id, updates) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === id
          ? typeof updates === 'function'
            ? { ...form, ...updates(form) }
            : { ...form, ...updates }
          : form,
      ),
    )
  }, [])

  const deleteForm = useCallback((id) => {
    setForms((prev) => prev.filter((form) => form.id !== id))
  }, [])

  const getForm = useCallback(
    (id) => forms.find((f) => f.id === id),
    [forms],
  )

  const value = useMemo(
    () => ({ forms, isLoading, addForm, updateForm, deleteForm, getForm }),
    [forms, isLoading, addForm, updateForm, deleteForm, getForm],
  )

  return <FormsContext.Provider value={value}>{children}</FormsContext.Provider>
}

export function useForms() {
  const ctx = useContext(FormsContext)
  if (!ctx) throw new Error('useForms must be used within FormsProvider')
  return ctx
}
