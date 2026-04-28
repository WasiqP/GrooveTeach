import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

export default function StudentRecords() {
  const { classId, studentId } = useParams()
  const { classes, setStudentRemark } = useClasses()
  const { tasks, grades } = useGradesTasks()
  const { showSuccess } = usePulseAlert()

  const cls = classes.find((c) => c.id === classId)
  const student = cls?.students?.find((s) => s.id === studentId)
  const [remarkDraft, setRemarkDraft] = useState(student?.teacherRemark ?? '')
  const [followUp, setFollowUp] = useState(!!student?.followUp)

  const studentTasks = useMemo(() => {
    if (!cls) return []
    return tasks
      .filter((t) => t.classId === classId)
      .map((t) => {
        const g = grades.find(
          (gr) => gr.classId === classId && gr.taskId === t.id && gr.studentId === studentId,
        )
        return { task: t, grade: g }
      })
  }, [cls, classId, studentId, tasks, grades])

  const attendanceRows = useMemo(() => {
    if (!cls) return []
    const out = []
    for (const day of cls.attendanceHistory ?? []) {
      const e = day.entries.find((x) => x.studentId === studentId)
      if (e) out.push({ dateKey: day.dateKey, status: e.status, takenAt: day.takenAt })
    }
    return out.sort((a, b) => b.dateKey.localeCompare(a.dateKey))
  }, [cls, studentId])

  const counts = attendanceRows.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1
      return acc
    },
    { present: 0, late: 0, absent: 0 },
  )

  if (!cls || !student) {
    return (
      <>
        <TopBar subtitle="Student" title="Not found" />
        <Button as={Link} to={`/app/classes/${classId}/students`}>Back to roster</Button>
      </>
    )
  }

  const saveRemark = () => {
    setStudentRemark(classId, studentId, {
      teacherRemark: remarkDraft.trim(),
      followUp,
    })
    showSuccess('Saved', 'Your notes are private to you.')
  }

  return (
    <>
      <TopBar
        subtitle={`${cls.name} · Roster`}
        title={student.name}
        right={
          <Button as={Link} to={`/app/classes/${classId}/students`} size="sm" variant="outline">
            Back to roster
          </Button>
        }
      />

      <Link to={`/app/classes/${classId}/students`} className="tt-backLink">← Back to roster</Link>

      <section className="tt-detailGrid">
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Grades */}
          <div className="tt-card">
            <div className="tt-sectionLabel">Grades</div>
            <div className="tt-titleSection">Tasks for {student.name.split(' ')[0]}</div>
            {studentTasks.length === 0 ? (
              <p className="tt-body">No tasks in this class yet.</p>
            ) : (
              <div className="tt-cardRowList">
                {studentTasks.map(({ task, grade }) => (
                  <Link
                    key={task.id}
                    className="tt-row tt-rowLink"
                    to={`/app/grades/${classId}/${task.id}`}
                  >
                    <div className={`tt-rowIcon tt-rowIcon-violet`}>{(task.kind ?? 'q')[0].toUpperCase()}</div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{task.title}</div>
                      <div className="tt-rowMeta">{task.dueLabel ?? 'No due date'}</div>
                    </div>
                    <div className="tt-rowEnd" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span className={`tt-pill tt-pill-${grade?.status ?? 'pending'}`}>
                        {grade?.status ?? 'pending'}
                      </span>
                      <strong style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
                        {grade?.grade ?? '—'}
                      </strong>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Attendance */}
          <div className="tt-card">
            <div className="tt-sectionLabel">Attendance</div>
            <div className="tt-titleSection">History</div>
            <div className="tt-actionsRow">
              <span className="tt-pill tt-pill-present">{counts.present} present</span>
              <span className="tt-pill tt-pill-late">{counts.late} late</span>
              <span className="tt-pill tt-pill-absent">{counts.absent} absent</span>
            </div>
            {attendanceRows.length === 0 ? (
              <p className="tt-body">No attendance recorded yet.</p>
            ) : (
              <div className="tt-cardRowList">
                {attendanceRows.map((row) => (
                  <div key={row.dateKey} className="tt-row">
                    <div className={`tt-rowIcon tt-rowIcon-${row.status === 'present' ? 'teal' : row.status === 'late' ? 'amber' : 'rose'}`}>
                      {row.status[0].toUpperCase()}
                    </div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{row.dateKey}</div>
                      <div className="tt-rowMeta">{new Date(row.takenAt).toLocaleString()}</div>
                    </div>
                    <div className="tt-rowEnd">
                      <span className={`tt-pill tt-pill-${row.status}`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="tt-card">
            <div className="tt-sectionLabel">Profile</div>
            <div className="tt-titleSection">{student.name}</div>
            <div className="tt-rowMeta">Roll # {student.rollNumber ?? '—'}</div>
            <div className="tt-rowMeta">{student.email ?? 'No email'}</div>
          </div>

          <div className="tt-card tt-cardSoft">
            <div className="tt-sectionLabel">Teacher’s notes</div>
            <div className="tt-titleSection">Private remark</div>
            <p className="tt-body">Visible only to you.</p>

            <textarea
              className="tt-textArea"
              placeholder="Strong on word problems, struggles with timed quizzes…"
              value={remarkDraft}
              onChange={(e) => setRemarkDraft(e.target.value)}
            />

            <div className="tt-toggleRow">
              <div>
                <div className="tt-rowTitle">Follow up</div>
                <div className="tt-rowMeta">Surface this student in “Needs attention” lists.</div>
              </div>
              <button
                type="button"
                onClick={() => setFollowUp((v) => !v)}
                className={`tt-toggle ${followUp ? 'tt-toggle-on' : ''}`}
                aria-label="Toggle follow up"
              />
            </div>

            <Button onClick={saveRemark}>Save notes</Button>
          </div>
        </div>
      </section>
    </>
  )
}
