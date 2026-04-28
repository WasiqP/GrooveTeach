import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const STATUS_OPTIONS = [
  { value: 'graded', label: 'Graded' },
  { value: 'pending', label: 'Pending' },
  { value: 'missing', label: 'Missing' },
]

export default function TaskGradeReport() {
  const { classId, taskId } = useParams()
  const { classes } = useClasses()
  const { tasks, grades, setGradeFor } = useGradesTasks()
  const { showSuccess } = usePulseAlert()

  const cls = classes.find((c) => c.id === classId)
  const task = tasks.find((t) => t.id === taskId && t.classId === classId)

  const rows = useMemo(() => {
    if (!cls || !task) return []
    return (cls.students ?? []).map((s) => {
      const g = grades.find(
        (gr) => gr.classId === classId && gr.taskId === taskId && gr.studentId === s.id,
      )
      return { student: s, grade: g }
    })
  }, [cls, task, grades, classId, taskId])

  const [drafts, setDrafts] = useState({})

  if (!cls || !task) {
    return (
      <>
        <TopBar subtitle="Gradebook" title="Task not found" />
        <Button as={Link} to="/app/grades">Back to grades</Button>
      </>
    )
  }

  const counts = rows.reduce(
    (acc, r) => {
      const status = r.grade?.status ?? 'pending'
      acc[status] = (acc[status] ?? 0) + 1
      return acc
    },
    { graded: 0, pending: 0, missing: 0 },
  )

  const updateRow = (studentId, patch) => {
    setGradeFor(classId, taskId, studentId, patch)
  }

  const setRowGrade = (studentId, value) => {
    setDrafts((d) => ({ ...d, [studentId]: value }))
  }

  const commitGrade = (studentId) => {
    const value = drafts[studentId]
    if (value == null) return
    const trimmed = value.trim()
    updateRow(studentId, {
      grade: trimmed || '—',
      status: trimmed ? 'graded' : 'pending',
    })
    showSuccess('Saved', 'Grade updated.')
  }

  return (
    <>
      <TopBar
        subtitle={`${cls.name} · ${task.kind ?? 'task'}`}
        title={task.title}
        right={
          <Button as={Link} to="/app/grades" size="sm" variant="outline">
            Back to gradebook
          </Button>
        }
      />

      <Link to="/app/grades" className="tt-backLink">← Back to gradebook</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Summary</div>
          <div className="tt-titleSection">
            {rows.length} student{rows.length === 1 ? '' : 's'}
          </div>
          <div className="tt-actionsRow">
            <span className="tt-pill tt-pill-graded">{counts.graded} graded</span>
            <span className="tt-pill tt-pill-pending">{counts.pending} pending</span>
            <span className="tt-pill tt-pill-missing">{counts.missing} missing</span>
          </div>
          {task.dueLabel ? <div className="tt-rowMeta tt-mt-8">{task.dueLabel}</div> : null}
        </div>

        {rows.length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">No students in this class</div>
            <p className="tt-body">Add a roster on the class to grade this task.</p>
            <Button as={Link} to={`/app/classes/${classId}/students`}>Manage roster</Button>
          </div>
        ) : (
          <div className="tt-card">
            <div className="tt-sectionLabel">Roster</div>
            <div className="tt-titleSection">Grade every student</div>
            <div className="tt-cardRowList">
              {rows.map(({ student, grade }) => {
                const status = grade?.status ?? 'pending'
                const draft = drafts[student.id] ?? grade?.grade ?? ''
                return (
                  <div key={student.id} className="tt-row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="tt-rowIcon tt-rowIcon-violet">
                      {student.rollNumber ?? student.name[0]?.toUpperCase()}
                    </div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{student.name}</div>
                      <div className="tt-rowMeta">
                        <Link to={`/app/classes/${classId}/students/${student.id}`}>Open profile</Link>
                      </div>
                    </div>
                    <div className="tt-rowEnd" style={{ flexWrap: 'wrap', gap: 8 }}>
                      <input
                        className="tt-textField"
                        value={draft}
                        placeholder="A, 92%, 18/20…"
                        style={{ width: 110 }}
                        onChange={(e) => setRowGrade(student.id, e.target.value)}
                        onBlur={() => commitGrade(student.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur()
                          }
                        }}
                      />
                      <select
                        className="tt-textField"
                        style={{ width: 130 }}
                        value={status}
                        onChange={(e) => updateRow(student.id, { status: e.target.value })}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <span className={`tt-pill tt-pill-${status}`}>{status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
