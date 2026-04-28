import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import './Dashboard.css'

const KIND_LABEL = { quiz: 'Quiz', assignment: 'Assignment', test: 'Test', project: 'Project' }
const KIND_OPTIONS = ['all', 'quiz', 'assignment', 'test', 'project']
const STATUS_OPTIONS = ['all', 'graded', 'pending', 'missing']

export default function ViewGrades() {
  const { classes } = useClasses()
  const { tasks, grades } = useGradesTasks()
  const [classFilter, setClassFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  const taskRows = useMemo(() => {
    return tasks
      .filter((t) => (classFilter === 'all' ? true : t.classId === classFilter))
      .filter((t) => (kindFilter === 'all' ? true : t.kind === kindFilter))
      .filter((t) => {
        if (!query.trim()) return true
        return t.title.toLowerCase().includes(query.trim().toLowerCase())
      })
      .map((t) => {
        const gradesForTask = grades.filter(
          (g) => g.classId === t.classId && g.taskId === t.id,
        )
        const counts = gradesForTask.reduce(
          (acc, g) => {
            acc.total += 1
            acc[g.status] = (acc[g.status] ?? 0) + 1
            return acc
          },
          { total: 0, graded: 0, pending: 0, missing: 0 },
        )

        // status filter applies to the task IF any grade matches
        const passes =
          statusFilter === 'all'
            ? true
            : gradesForTask.some((g) => g.status === statusFilter)

        return passes ? { task: t, counts } : null
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.task.createdAt) - new Date(a.task.createdAt))
  }, [tasks, grades, classFilter, kindFilter, statusFilter, query])

  return (
    <>
      <TopBar
        subtitle="Gradebook"
        title="View grades"
        right={<Button as={Link} to="/app/quizzes/new" size="sm">+ New task</Button>}
      />

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Filters</div>
          <div className="tt-formGrid">
            <div>
              <label className="tt-fieldLabel">Class</label>
              <select
                className="tt-textField"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="tt-fieldLabel">Kind</label>
              <select
                className="tt-textField"
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value)}
              >
                {KIND_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k === 'all' ? 'All' : KIND_LABEL[k]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="tt-fieldLabel">Status</label>
              <select
                className="tt-textField"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="tt-fieldLabel">Search</label>
              <input
                className="tt-textField"
                placeholder="Find a task by title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="tt-dashSection">
        {taskRows.length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">No tasks match</div>
            <p className="tt-body">Loosen your filters or build a new task to get started.</p>
            <Button as={Link} to="/app/quizzes/new">Create a task</Button>
          </div>
        ) : (
          <div className="tt-card">
            <div className="tt-sectionLabel">Tasks</div>
            <div className="tt-titleSection">{taskRows.length} task{taskRows.length === 1 ? '' : 's'}</div>
            <div className="tt-cardRowList">
              {taskRows.map(({ task, counts }) => {
                const cls = classes.find((c) => c.id === task.classId)
                return (
                  <Link
                    key={task.id}
                    className="tt-row tt-rowLink"
                    to={`/app/grades/${task.classId}/${task.id}`}
                  >
                    <div className={`tt-rowIcon tt-rowIcon-violet`}>
                      {(task.kind ?? 'q')[0].toUpperCase()}
                    </div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{task.title}</div>
                      <div className="tt-rowMeta">
                        {cls?.name ?? 'Class removed'} · {task.dueLabel ?? 'No due date'}
                      </div>
                      <div className="tt-actionsRow tt-mt-8">
                        <span className="tt-pill tt-pill-graded">{counts.graded} graded</span>
                        <span className="tt-pill tt-pill-pending">{counts.pending} pending</span>
                        {counts.missing > 0 ? (
                          <span className="tt-pill tt-pill-missing">{counts.missing} missing</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="tt-rowEnd">
                      <span className={`tt-pill tt-pill-${task.kind ?? 'quiz'}`}>{task.kind ?? 'quiz'}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
