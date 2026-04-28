import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'teachtrack:classes:v1'

/**
 * Mirrors PulseBox ClassesContext on web.
 *
 * Class shape:
 *   id, name, subject, gradeLevel, schedule, roomNumber?, schoolName?, schoolType?,
 *   students: [{ id, name, rollNumber?, email?, teacherRemark?, teacherRemarkUpdatedAt?, followUp? }],
 *   announcements: [{ id, body, createdAt }],
 *   activityLog: [{ id, kind: 'announcement'|'attendance'|'task_assigned', headline, detail?, createdAt }],
 *   attendanceHistory: [{ id, dateKey, takenAt, entries: [{ studentId, status }] }],
 *   reminder?: { enabled, dayOfWeek, time, label },
 *   createdAt
 */

const SCHOOL_TYPES = ['School', 'College', 'University', 'Others']

function nowIso() {
  return new Date().toISOString()
}

function daysAgoIso(days) {
  return new Date(Date.now() - days * 86400000).toISOString()
}

function defaultClasses() {
  return [
    {
      id: '1',
      name: 'Mathematics 101',
      subject: 'Mathematics',
      gradeLevel: 'Grade 10',
      schedule: 'Mon, Wed, Fri · 9:00 AM – 10:00 AM',
      roomNumber: 'Room 205',
      schoolName: 'Westside Academy',
      schoolType: 'School',
      students: [
        { id: 's1', name: 'Alex Morgan', rollNumber: '01', email: 'alex.m@school.edu' },
        { id: 's2', name: 'Jordan Lee', rollNumber: '02', email: 'jordan.l@school.edu' },
        { id: 's3', name: 'Sam Rivera', rollNumber: '03', email: 'sam.r@school.edu' },
      ],
      announcements: [
        {
          id: 'an-seed-m1',
          body: 'Welcome back — syllabus week is on the portal.',
          createdAt: daysAgoIso(2),
        },
      ],
      activityLog: [
        {
          id: 'act-seed-m1',
          kind: 'announcement',
          headline: 'Posted an announcement',
          detail: 'Welcome back — syllabus week is on the portal.',
          createdAt: daysAgoIso(2),
        },
        {
          id: 'act-seed-m1-att',
          kind: 'attendance',
          headline: 'Attendance marked',
          detail: '3 present · 0 late · 0 absent',
          createdAt: daysAgoIso(3),
        },
      ],
      attendanceHistory: [],
      reminder: null,
      createdAt: nowIso(),
    },
    {
      id: '2',
      name: 'English Literature',
      subject: 'English',
      gradeLevel: 'Grade 11',
      schedule: 'Tue, Thu · 10:30 AM – 11:30 AM',
      roomNumber: 'Room 301',
      schoolName: 'Westside Academy',
      schoolType: 'School',
      students: [
        { id: 's4', name: 'Casey Kim', rollNumber: '01', email: 'casey.k@school.edu' },
        { id: 's5', name: 'Riley Chen', rollNumber: '02', email: 'riley.c@school.edu' },
      ],
      announcements: [
        {
          id: 'an-seed-e1',
          body: 'Reading circle meets Thursdays after school.',
          createdAt: daysAgoIso(1),
        },
      ],
      activityLog: [
        {
          id: 'act-seed-e1',
          kind: 'announcement',
          headline: 'Posted an announcement',
          detail: 'Reading circle meets Thursdays after school.',
          createdAt: daysAgoIso(1),
        },
      ],
      attendanceHistory: [],
      reminder: null,
      createdAt: nowIso(),
    },
  ]
}

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

const ClassesContext = createContext(null)

export function ClassesProvider({ children }) {
  const [classes, setClasses] = useState(() => readStored() ?? defaultClasses())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
    } catch {
      // ignore quota issues
    }
  }, [classes])

  const addClass = useCallback((classData) => {
    setClasses((prev) => [classData, ...prev])
  }, [])

  const updateClass = useCallback((id, updates) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === id
          ? typeof updates === 'function'
            ? { ...cls, ...updates(cls) }
            : { ...cls, ...updates }
          : cls,
      ),
    )
  }, [])

  const deleteClass = useCallback((id) => {
    setClasses((prev) => prev.filter((cls) => cls.id !== id))
  }, [])

  /** Append an announcement and a matching activity log entry. */
  const postAnnouncement = useCallback((classId, body) => {
    const trimmed = body.trim()
    if (!trimmed) return
    const createdAt = nowIso()
    const announcement = {
      id: `an-${Date.now()}`,
      body: trimmed,
      createdAt,
    }
    const activity = {
      id: `act-${Date.now()}`,
      kind: 'announcement',
      headline: 'Posted an announcement',
      detail: trimmed,
      createdAt,
    }
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              announcements: [announcement, ...(cls.announcements ?? [])],
              activityLog: [activity, ...(cls.activityLog ?? [])],
            }
          : cls,
      ),
    )
  }, [])

  /**
   * Save attendance for a class on a given dateKey. Latest save wins per dateKey.
   * entries: [{ studentId, status: 'present'|'absent'|'late' }]
   */
  const saveAttendance = useCallback((classId, dateKey, entries) => {
    const takenAt = nowIso()
    const record = {
      id: `att-${classId}-${dateKey}`,
      dateKey,
      takenAt,
      entries,
    }

    const counts = entries.reduce(
      (acc, e) => {
        acc[e.status] = (acc[e.status] ?? 0) + 1
        return acc
      },
      { present: 0, absent: 0, late: 0 },
    )

    const activity = {
      id: `act-att-${Date.now()}`,
      kind: 'attendance',
      headline: 'Attendance marked',
      detail: `${counts.present} present · ${counts.late} late · ${counts.absent} absent`,
      createdAt: takenAt,
    }

    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== classId) return cls
        const history = cls.attendanceHistory ?? []
        const idx = history.findIndex((d) => d.dateKey === dateKey)
        const nextHistory =
          idx >= 0
            ? history.map((d, i) => (i === idx ? record : d))
            : [record, ...history]
        return {
          ...cls,
          attendanceHistory: nextHistory,
          activityLog: [activity, ...(cls.activityLog ?? [])],
        }
      }),
    )
  }, [])

  /** Append a 'task_assigned' activity entry to a class. */
  const logTaskAssigned = useCallback((classId, headline, detail) => {
    const activity = {
      id: `act-task-${Date.now()}-${classId}`,
      kind: 'task_assigned',
      headline,
      detail,
      createdAt: nowIso(),
    }
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? { ...cls, activityLog: [activity, ...(cls.activityLog ?? [])] }
          : cls,
      ),
    )
  }, [])

  /** Set a per-student teacher remark + follow-up flag. */
  const setStudentRemark = useCallback((classId, studentId, patch) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== classId) return cls
        const students = (cls.students ?? []).map((s) =>
          s.id === studentId
            ? {
                ...s,
                ...patch,
                teacherRemarkUpdatedAt:
                  patch.teacherRemark !== undefined ? nowIso() : s.teacherRemarkUpdatedAt,
              }
            : s,
        )
        return { ...cls, students }
      }),
    )
  }, [])

  const value = useMemo(
    () => ({
      classes,
      isLoading,
      addClass,
      updateClass,
      deleteClass,
      postAnnouncement,
      saveAttendance,
      logTaskAssigned,
      setStudentRemark,
    }),
    [
      classes,
      isLoading,
      addClass,
      updateClass,
      deleteClass,
      postAnnouncement,
      saveAttendance,
      logTaskAssigned,
      setStudentRemark,
    ],
  )

  return <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>
}

export function useClasses() {
  const ctx = useContext(ClassesContext)
  if (!ctx) throw new Error('useClasses must be used within ClassesProvider')
  return ctx
}

export { SCHOOL_TYPES }
