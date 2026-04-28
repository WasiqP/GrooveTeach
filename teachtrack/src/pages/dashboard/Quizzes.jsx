import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useForms } from '../../context/FormsContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import { useClasses } from '../../context/ClassesContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const TASK_KIND_LABEL = { quiz: 'Quiz', assignment: 'Assignment', test: 'Test', project: 'Project' }

export default function Quizzes() {
  const { forms, deleteForm } = useForms()
  const { removeTasksForForm } = useGradesTasks()
  const { classes } = useClasses()
  const { showAlert, showSuccess } = usePulseAlert()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return forms
    return forms.filter((f) =>
      [f.name, f?.answers?.taskKind, f?.answers?.focusTopic]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [forms, query])

  const handleDelete = (form) => {
    showAlert({
      title: `Delete “${form.name}”?`,
      message: 'Removes this task and any pending grade rows it created.',
      variant: 'warning',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeTasksForForm(form.id)
            deleteForm(form.id)
            showSuccess('Removed')
          },
        },
      ],
    })
  }

  return (
    <>
      <TopBar
        subtitle="Quizzes & assignments"
        title="Your tasks library"
        right={<Button as={Link} to="/app/quizzes/new" size="sm">+ New task</Button>}
      />

      <section className="tt-dashSection">
        <div className="tt-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search by title or focus topic…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="tt-dashSection">
        {filtered.length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">
              {forms.length === 0 ? 'No quizzes yet' : 'No matches'}
            </div>
            <p className="tt-body">
              {forms.length === 0
                ? 'Build your first quiz, assignment or test. TeeTee will keep it ready to share.'
                : 'Try a different search.'}
            </p>
            {forms.length === 0 ? (
              <Button as={Link} to="/app/quizzes/new">Create your first task</Button>
            ) : null}
          </div>
        ) : (
          <div className="tt-cardGrid">
            {filtered.map((f) => {
              const kind = f?.answers?.taskKind ?? 'quiz'
              const cls = classes.find((c) => c.id === f?.answers?.classId)
              const qCount = (f?.answers?.questions ?? []).length
              return (
                <div key={f.id} className="tt-card">
                  <div className="tt-sectionLabel">{TASK_KIND_LABEL[kind] ?? 'Task'}</div>
                  <div className="tt-titleSection">{f.name}</div>
                  <div className="tt-rowMeta">
                    {cls?.name ?? 'Unassigned'} · {qCount} question{qCount === 1 ? '' : 's'}
                  </div>
                  {f?.answers?.dueLabel ? (
                    <div className="tt-rowMeta">{f.answers.dueLabel}</div>
                  ) : null}

                  <div className="tt-actionsRow tt-mt-12">
                    <Button as={Link} to={`/app/quizzes/${f.id}`} size="sm">
                      Edit
                    </Button>
                    <Button as={Link} to={`/app/quizzes/${f.id}/share`} size="sm" variant="secondary">
                      Share
                    </Button>
                    <Button onClick={() => handleDelete(f)} size="sm" variant="ghost">
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
