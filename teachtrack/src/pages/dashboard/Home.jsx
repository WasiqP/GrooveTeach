import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useUser } from '../../context/UserContext'
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

function greetingByHour() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { firstName } = useUser()
  const { classes, postAnnouncement } = useClasses()
  const { tasks, grades } = useGradesTasks()
  const { showSuccess, showWarning } = usePulseAlert()

  const [announcementText, setAnnouncementText] = useState('')
  const [announcementClassId, setAnnouncementClassId] = useState(
    classes[0]?.id ?? '',
  )

  const stats = useMemo(() => {
    const totalStudents = classes.reduce(
      (acc, c) => acc + (c.students?.length ?? 0),
      0,
    )
    const pendingGrades = grades.filter((g) => g.status === 'pending').length
    const tasksThisWeek = tasks.filter((t) => {
      const d = new Date(t.createdAt)
      const week = 7 * 86400000
      return Date.now() - d.getTime() < week
    }).length
    return {
      classCount: classes.length,
      students: totalStudents,
      tasksThisWeek,
      pending: pendingGrades,
    }
  }, [classes, tasks, grades])

  // Flatten and sort all class activity (newest first, top 6).
  const recentActivity = useMemo(() => {
    const all = []
    for (const cls of classes) {
      for (const item of cls.activityLog ?? []) {
        all.push({ ...item, className: cls.name, classId: cls.id })
      }
    }
    return all
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
  }, [classes])

  const upcoming = useMemo(() => {
    return tasks
      .slice()
      .sort((a, b) => {
        const da = a.dueAt ? new Date(a.dueAt).getTime() : Number.POSITIVE_INFINITY
        const db = b.dueAt ? new Date(b.dueAt).getTime() : Number.POSITIVE_INFINITY
        return da - db
      })
      .slice(0, 4)
  }, [tasks])

  const handlePostAnnouncement = () => {
    if (!announcementClassId) {
      showWarning('Pick a class', 'Choose which class should see this announcement.')
      return
    }
    if (!announcementText.trim()) {
      showWarning('Write something', 'Your announcement is empty.')
      return
    }
    postAnnouncement(announcementClassId, announcementText)
    setAnnouncementText('')
    showSuccess('Announcement posted', 'Your class will see it under recent activity.')
  }

  return (
    <>
      <TopBar
        subtitle={`${greetingByHour()}, ${firstName || 'Teacher'}`}
        title="Today on TeachTrack"
        right={
          <Button as={Link} to="/app/quizzes/new" size="sm">
            New quiz
          </Button>
        }
      />

      <section className="tt-dashSection">
        <div className="tt-statRow">
          <div className="tt-stat">
            <div className="tt-statValue">{stats.classCount}</div>
            <div className="tt-statLabel">Active classes</div>
          </div>
          <div className="tt-stat">
            <div className="tt-statValue">{stats.students}</div>
            <div className="tt-statLabel">Total students</div>
          </div>
          <div className="tt-stat">
            <div className="tt-statValue">{stats.tasksThisWeek}</div>
            <div className="tt-statLabel">Tasks this week</div>
          </div>
          <div className="tt-stat">
            <div className="tt-statValue">{stats.pending}</div>
            <div className="tt-statLabel">To grade</div>
          </div>
        </div>
      </section>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Quick actions</div>
          <div className="tt-titleSection">Jump back in</div>
          <p className="tt-body">
            TeeTee is ready when you are. Pick where you left off.
          </p>
          <div className="tt-actionsRow">
            <Button as={Link} to="/app/classes/new">Create a class</Button>
            <Button as={Link} to="/app/quizzes/new" variant="secondary">Build a quiz</Button>
            <Button as={Link} to="/app/attendance" variant="outline">Take attendance</Button>
            <Button as={Link} to="/app/lesson-planner" variant="ghost">Plan a lesson</Button>
          </div>
        </div>
      </section>

      <section className="tt-dashSection tt-cardGrid-2">
        <div className="tt-card">
          <div className="tt-sectionLabel">Recent activity</div>
          <div className="tt-titleSection">What changed today</div>
          {recentActivity.length === 0 ? (
            <p className="tt-body">No activity yet. Post an announcement or take attendance to get started.</p>
          ) : (
            <div className="tt-cardRowList">
              {recentActivity.map((row) => {
                const icon = activityIcon(row.kind)
                return (
                  <Link
                    className="tt-row tt-rowLink"
                    key={row.id}
                    to={`/app/classes/${row.classId}`}
                  >
                    <div className={`tt-rowIcon ${icon.cls}`}>{icon.label}</div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{row.headline}</div>
                      <div className="tt-rowMeta">
                        {row.className} · {timeAgo(row.createdAt)}
                      </div>
                      {row.detail ? (
                        <div className="tt-rowMeta tt-mt-8">{row.detail}</div>
                      ) : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="tt-card tt-cardSoft">
          <div className="tt-sectionLabel">Announcement</div>
          <div className="tt-titleSection">Post to a class</div>
          <p className="tt-body">
            Anything you write here lands in that class’s feed.
          </p>

          <select
            className="tt-textField"
            value={announcementClassId}
            onChange={(e) => setAnnouncementClassId(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea
            className="tt-textArea"
            placeholder="Tell your class…"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />

          <Button onClick={handlePostAnnouncement}>Post announcement</Button>
        </div>
      </section>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionRow">
            <div>
              <div className="tt-sectionLabel">Upcoming</div>
              <div className="tt-titleSection">Tasks to keep an eye on</div>
            </div>
            <Button as={Link} to="/app/grades" size="sm" variant="outline">
              View grades
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <p className="tt-body">Nothing due. Build a quiz to assign one.</p>
          ) : (
            <div className="tt-cardRowList">
              {upcoming.map((t) => {
                const cls = classes.find((c) => c.id === t.classId)
                return (
                  <Link
                    key={t.id}
                    className="tt-row tt-rowLink"
                    to={`/app/grades/${t.classId}/${t.id}`}
                  >
                    <div className={`tt-rowIcon tt-pill-${t.kind ?? 'quiz'}`}>{(t.kind ?? 'q')[0].toUpperCase()}</div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{t.title}</div>
                      <div className="tt-rowMeta">
                        {cls?.name ?? 'Class'} · {t.dueLabel ?? 'No due date'}
                      </div>
                    </div>
                    <div className="tt-rowEnd">
                      <span className={`tt-pill tt-pill-${t.kind ?? 'quiz'}`}>{t.kind ?? 'quiz'}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
