import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const STORAGE_KEY = 'teachtrack:grades_tasks:v1'

/**
 * Mirrors PulseBox GradesTasksContext.
 *
 * Task: { id, classId, title, kind, dueLabel?, dueAt?, createdAt, formId? }
 *   kind: 'quiz' | 'assignment' | 'project' | 'test'
 *
 * Grade: { id, classId, taskId, studentId, grade, status }
 *   status: 'graded' | 'pending' | 'missing'
 */

const SEED = {
  tasks: [
    { id: 'task-m1-mid', classId: '1', title: 'Midterm quiz', kind: 'quiz', dueLabel: 'Oct 15', createdAt: '2025-10-01T12:00:00.000Z' },
    { id: 'task-m1-ps', classId: '1', title: 'Problem set 3', kind: 'assignment', dueLabel: 'Oct 18', createdAt: '2025-10-03T09:30:00.000Z' },
    { id: 'task-m1-lab', classId: '1', title: 'Lab report — motion', kind: 'project', dueLabel: 'Oct 22', createdAt: '2025-10-05T16:00:00.000Z' },
    { id: 'task-e1-essay', classId: '2', title: 'Essay draft', kind: 'assignment', dueLabel: 'Oct 20', createdAt: '2025-10-02T11:00:00.000Z' },
    { id: 'task-e1-vocab', classId: '2', title: 'Vocabulary test', kind: 'test', dueLabel: 'Oct 12', createdAt: '2025-09-28T14:00:00.000Z' },
  ],
  grades: [
    { id: 'g1', classId: '1', taskId: 'task-m1-mid', studentId: 's1', grade: '92%', status: 'graded' },
    { id: 'g2', classId: '1', taskId: 'task-m1-mid', studentId: 's2', grade: '88%', status: 'graded' },
    { id: 'g3', classId: '1', taskId: 'task-m1-mid', studentId: 's3', grade: '76%', status: 'graded' },
    { id: 'g4', classId: '1', taskId: 'task-m1-ps', studentId: 's1', grade: 'A−', status: 'graded' },
    { id: 'g5', classId: '1', taskId: 'task-m1-ps', studentId: 's2', grade: 'B+', status: 'graded' },
    { id: 'g6', classId: '1', taskId: 'task-m1-ps', studentId: 's3', grade: '—', status: 'missing' },
    { id: 'g7', classId: '1', taskId: 'task-m1-lab', studentId: 's1', grade: '18/20', status: 'graded' },
    { id: 'g8', classId: '1', taskId: 'task-m1-lab', studentId: 's2', grade: '17/20', status: 'graded' },
    { id: 'g9', classId: '1', taskId: 'task-m1-lab', studentId: 's3', grade: 'Pending', status: 'pending' },
    { id: 'g10', classId: '2', taskId: 'task-e1-essay', studentId: 's4', grade: 'B', status: 'graded' },
    { id: 'g11', classId: '2', taskId: 'task-e1-essay', studentId: 's5', grade: 'A−', status: 'graded' },
    { id: 'g12', classId: '2', taskId: 'task-e1-vocab', studentId: 's4', grade: '40/45', status: 'graded' },
    { id: 'g13', classId: '2', taskId: 'task-e1-vocab', studentId: 's5', grade: '42/45', status: 'graded' },
  ],
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.grades)) return parsed
    return null
  } catch {
    return null
  }
}

const GradesTasksContext = createContext(null)

export function GradesTasksProvider({ children }) {
  const initial = readStored()
  const [tasks, setTasks] = useState(initial?.tasks ?? SEED.tasks)
  const [grades, setGrades] = useState(initial?.grades ?? SEED.grades)
  const [isLoading] = useState(false)

  const tasksRef = useRef(tasks)
  const gradesRef = useRef(grades)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])
  useEffect(() => {
    gradesRef.current = grades
  }, [grades])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, grades }))
    } catch {
      // ignore
    }
  }, [tasks, grades])

  const getGrade = useCallback(
    (classId, taskId, studentId) =>
      grades.find(
        (g) => g.classId === classId && g.taskId === taskId && g.studentId === studentId,
      ),
    [grades],
  )

  const getTasksForClass = useCallback(
    (classId) =>
      tasks
        .filter((t) => t.classId === classId)
        .sort((a, b) => a.title.localeCompare(b.title)),
    [tasks],
  )

  /**
   * Idempotent fan-out: assign a form to one or more classes.
   *
   * payload: {
   *   formId, title, kind, dueLabel?, dueAt?,
   *   targets: [{ classId, studentIds: [studentId, ...] }]
   * }
   */
  const assignFormToClasses = useCallback((payload) => {
    const now = new Date().toISOString()
    let nextTasks = [...tasksRef.current]
    let nextGrades = [...gradesRef.current]

    for (const target of payload.targets) {
      const taskId = `form-${payload.formId}-cls-${target.classId}`
      const taskRow = {
        id: taskId,
        classId: target.classId,
        title: payload.title,
        kind: payload.kind,
        dueLabel: payload.dueLabel,
        dueAt: payload.dueAt,
        createdAt: now,
        formId: payload.formId,
      }
      const idx = nextTasks.findIndex((t) => t.id === taskId)
      if (idx >= 0) {
        nextTasks[idx] = taskRow
      } else {
        nextTasks.push(taskRow)
      }
      for (const studentId of target.studentIds) {
        const exists = nextGrades.some(
          (g) =>
            g.classId === target.classId &&
            g.taskId === taskId &&
            g.studentId === studentId,
        )
        if (!exists) {
          nextGrades.push({
            id: `g-${taskId}-${studentId}`,
            classId: target.classId,
            taskId,
            studentId,
            grade: '—',
            status: 'pending',
          })
        }
      }
    }

    setTasks(nextTasks)
    setGrades(nextGrades)
  }, [])

  /** Cascade delete: remove every task + grade tied to a form. */
  const removeTasksForForm = useCallback((formId) => {
    const prevT = tasksRef.current
    const prevG = gradesRef.current
    const removedIds = new Set(
      prevT.filter((t) => t.formId === formId).map((t) => t.id),
    )
    if (removedIds.size === 0) return
    setTasks(prevT.filter((t) => t.formId !== formId))
    setGrades(prevG.filter((g) => !removedIds.has(g.taskId)))
  }, [])

  /** Update a single grade row (graded/pending/missing + value). */
  const setGradeFor = useCallback((classId, taskId, studentId, patch) => {
    setGrades((prev) => {
      const idx = prev.findIndex(
        (g) => g.classId === classId && g.taskId === taskId && g.studentId === studentId,
      )
      if (idx < 0) {
        return [
          ...prev,
          {
            id: `g-${taskId}-${studentId}-${Date.now()}`,
            classId,
            taskId,
            studentId,
            grade: '—',
            status: 'pending',
            ...patch,
          },
        ]
      }
      return prev.map((g, i) => (i === idx ? { ...g, ...patch } : g))
    })
  }, [])

  /** Remove all tasks/grades for a deleted class. */
  const removeTasksForClass = useCallback((classId) => {
    setTasks((prev) => prev.filter((t) => t.classId !== classId))
    setGrades((prev) => prev.filter((g) => g.classId !== classId))
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      grades,
      isLoading,
      getGrade,
      getTasksForClass,
      assignFormToClasses,
      removeTasksForForm,
      removeTasksForClass,
      setGradeFor,
    }),
    [
      tasks,
      grades,
      isLoading,
      getGrade,
      getTasksForClass,
      assignFormToClasses,
      removeTasksForForm,
      removeTasksForClass,
      setGradeFor,
    ],
  )

  return (
    <GradesTasksContext.Provider value={value}>{children}</GradesTasksContext.Provider>
  )
}

export function useGradesTasks() {
  const ctx = useContext(GradesTasksContext)
  if (!ctx) throw new Error('useGradesTasks must be used within GradesTasksProvider')
  return ctx
}
