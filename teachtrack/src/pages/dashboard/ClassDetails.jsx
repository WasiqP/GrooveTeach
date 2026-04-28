import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 45) return 'Just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function activityIcon(kind) {
  if (kind === 'announcement') return { label: 'A', cls: 'tt-rowIcon-violet' }
  if (kind === 'attendance') return { label: '✓', cls: 'tt-rowIcon-teal' }
  return { label: 'T', cls: 'tt-rowIcon-amber' }
}

export default function ClassDetails() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { classes, postAnnouncement, deleteClass, updateClass } = useClasses()
  const { tasks, removeTasksForClass } = useGradesTasks()
  const { showAlert, showSuccess } = usePulseAlert()

  const cls = classes.find((c) => c.id === classId)
  const [draft, setDraft] = useState('')

  const classTasks = useMemo(
    () => tasks.filter((t) => t.classId === classId),
    [tasks, classId],
  )

  const attendanceSummary = useMemo(() => {
    const history = cls?.attendanceHistory ?? []
    const last = history[0]
    let totalPresent = 0
    let totalEntries = 0
    for (const day of history) {
      for (const e of day.entries) {
        totalEntries += 1
        if (e.status === 'present') totalPresent += 1
      }
    }
    const rate = totalEntries === 0 ? null : Math.round((totalPresent / totalEntries) * 100)
    return { last, totalDays: history.length, attendanceRate: rate }
  }, [cls])

  if (!cls) {
    return (
      <>
        <TopBar subtitle="Class" title="Not found" />
        <section className="tt-dashSection">
          <div className="tt-card">
            <div className="tt-titleSection">This class was deleted or doesn’t exist.</div>
            <Button as={Link} to="/app/classes">Back to classes</Button>
          </div>
        </section>
      </>
    )
  }

  const handlePost = () => {
    if (!draft.trim()) return
    postAnnouncement(classId, draft)
    setDraft('')
    showSuccess('Announcement posted')
  }

  const confirmDelete = () => {
    showAlert({
      title: 'Delete this class?',
      message: 'This removes the roster, announcements and any tasks attached to it.',
      variant: 'warning',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeTasksForClass(classId)
            deleteClass(classId)
            navigate('/app/classes')
          },
        },
      ],
    })
  }

  const reminder = cls.reminder
  const toggleReminder = () => {
    if (!reminder?.enabled) {
      updateClass(classId, {
        reminder: {
          enabled: true,
          dayOfWeek: 1,
          time: '08:30',
          label: `Heads up — ${cls.name} today`,
        },
      })
    } else {
      updateClass(classId, { reminder: { ...reminder, enabled: false } })
    }
  }

  return (
    <>
      <TopBar
        subtitle={cls.subject}
        title={cls.name}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button as={Link} to={`/app/classes/${classId}/attendance`} size="sm">
              Take attendance
            </Button>
            <Button as={Link} to={`/app/classes/${classId}/students`} size="sm" variant="outline">
              View roster
            </Button>
          </div>
        }
      />

      <Link to="/app/classes" className="tt-backLink">← All classes</Link>

      <section className="tt-detailGrid">
        {/* Left column */}
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Announcement composer */}
          <div className="tt-card tt-cardSoft">
            <div className="tt-sectionLabel">Announcement</div>
            <div className="tt-titleSection">Talk to your class</div>
            <textarea
              className="tt-textArea"
              placeholder="Reading circle moves to Friday at 3pm…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="tt-actionsRow">
              <Button onClick={handlePost}>Post announcement</Button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="tt-card">
            <div className="tt-sectionLabel">Activity</div>
            <div className="tt-titleSection">Recent activity</div>
            {(cls.activityLog ?? []).length === 0 ? (
              <p className="tt-body">No activity yet.</p>
            ) : (
              <div className="tt-cardRowList">
                {(cls.activityLog ?? []).slice(0, 8).map((row) => {
                  const icon = activityIcon(row.kind)
                  return (
                    <div key={row.id} className="tt-row">
                      <div className={`tt-rowIcon ${icon.cls}`}>{icon.label}</div>
                      <div className="tt-rowBody">
                        <div className="tt-rowTitle">{row.headline}</div>
                        <div className="tt-rowMeta">{timeAgo(row.createdAt)}</div>
                        {row.detail ? (
                          <div className="tt-rowMeta tt-mt-8">{row.detail}</div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="tt-card">
            <div className="tt-sectionRow">
              <div>
                <div className="tt-sectionLabel">Tasks</div>
                <div className="tt-titleSection">Assigned to this class</div>
              </div>
              <Button as={Link} to="/app/quizzes/new" size="sm">
                + New task
              </Button>
            </div>

            {classTasks.length === 0 ? (
              <p className="tt-body">No tasks for this class yet.</p>
            ) : (
              <div className="tt-cardRowList">
                {classTasks.map((t) => (
                  <Link
                    key={t.id}
                    className="tt-row tt-rowLink"
                    to={`/app/grades/${classId}/${t.id}`}
                  >
                    <div className={`tt-rowIcon tt-rowIcon-violet`}>{(t.kind ?? 'q')[0].toUpperCase()}</div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{t.title}</div>
                      <div className="tt-rowMeta">{t.dueLabel ?? 'No due date'}</div>
                    </div>
                    <div className="tt-rowEnd">
                      <span className={`tt-pill tt-pill-${t.kind ?? 'quiz'}`}>{t.kind ?? 'quiz'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="tt-card">
            <div className="tt-sectionLabel">Snapshot</div>
            <div className="tt-titleSection">At a glance</div>
            <div className="tt-rowMeta">{cls.gradeLevel}</div>
            <div className="tt-rowMeta">{cls.schedule}</div>
            {cls.roomNumber ? <div className="tt-rowMeta">{cls.roomNumber}</div> : null}
            {cls.schoolName ? <div className="tt-rowMeta">{cls.schoolName}</div> : null}

            <div className="tt-actionsRow tt-mt-12">
              <span className="tt-pill tt-pill-quiz">{cls.students?.length ?? 0} students</span>
              <span className="tt-pill tt-pill-assignment">{classTasks.length} tasks</span>
            </div>
          </div>

          <div className="tt-card">
            <div className="tt-sectionLabel">Attendance</div>
            <div className="tt-titleSection">
              {attendanceSummary.attendanceRate === null
                ? 'No history yet'
                : `${attendanceSummary.attendanceRate}% present rate`}
            </div>
            <div className="tt-rowMeta">
              {attendanceSummary.totalDays} day{attendanceSummary.totalDays === 1 ? '' : 's'} recorded
            </div>
            {attendanceSummary.last ? (
              <div className="tt-rowMeta">Latest: {attendanceSummary.last.dateKey}</div>
            ) : null}
            <div className="tt-actionsRow tt-mt-8">
              <Button as={Link} to={`/app/classes/${classId}/attendance`} size="sm">
                Take attendance
              </Button>
            </div>
          </div>

          <div className="tt-card">
            <div className="tt-sectionLabel">Reminder</div>
            <div className="tt-toggleRow" style={{ borderBottom: 0, padding: '4px 0 0' }}>
              <div>
                <div className="tt-rowTitle">Weekly nudge</div>
                <div className="tt-rowMeta">
                  {reminder?.enabled
                    ? `Mon · ${reminder.time}`
                    : 'TeeTee will buzz you the morning of class.'}
                </div>
              </div>
              <button
                type="button"
                className={`tt-toggle ${reminder?.enabled ? 'tt-toggle-on' : ''}`}
                onClick={toggleReminder}
                aria-label="Toggle weekly reminder"
              />
            </div>
          </div>

          <div className="tt-card">
            <div className="tt-sectionLabel">Danger zone</div>
            <div className="tt-titleSection">Remove class</div>
            <p className="tt-body">
              Deletes the class, its roster and any tasks assigned to it.
            </p>
            <Button onClick={confirmDelete} variant="outline">
              Delete this class
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
