import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useForms } from '../../context/FormsContext'
import { useClasses } from '../../context/ClassesContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const QUESTION_TYPE_LABEL = {
  shortText: 'Short answer',
  longText: 'Long answer',
  multipleChoice: 'Multiple choice',
  checkbox: 'Checkboxes',
  dropdown: 'Dropdown',
  rating: 'Rating',
  email: 'Email',
  number: 'Number',
  date: 'Date',
}

export default function EditForm() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { forms, updateForm, deleteForm } = useForms()
  const { classes } = useClasses()
  const { showAlert, showSuccess } = usePulseAlert()

  const form = forms.find((f) => f.id === formId)

  const questions = useMemo(() => form?.answers?.questions ?? [], [form])

  if (!form) {
    return (
      <>
        <TopBar subtitle="Quizzes" title="Task not found" />
        <Button as={Link} to="/app/quizzes">Back to quizzes</Button>
      </>
    )
  }

  const cls = classes.find((c) => c.id === form?.answers?.classId)

  const addQuestion = () => {
    const next = {
      id: `q${Date.now()}`,
      title: `Question ${questions.length + 1}`,
      type: 'shortText',
      required: false,
    }
    updateForm(form.id, (f) => ({
      answers: { ...(f.answers ?? {}), questions: [...questions, next] },
    }))
    navigate(`/app/quizzes/${form.id}/questions/${next.id}`)
  }

  const removeQuestion = (qid) => {
    updateForm(form.id, (f) => ({
      answers: {
        ...(f.answers ?? {}),
        questions: questions.filter((q) => q.id !== qid),
      },
    }))
  }

  const renameForm = (next) => {
    updateForm(form.id, { name: next })
  }

  const moveQuestion = (qid, dir) => {
    const idx = questions.findIndex((q) => q.id === qid)
    if (idx < 0) return
    const target = idx + dir
    if (target < 0 || target >= questions.length) return
    const arr = [...questions]
    const [moved] = arr.splice(idx, 1)
    arr.splice(target, 0, moved)
    updateForm(form.id, (f) => ({ answers: { ...(f.answers ?? {}), questions: arr } }))
  }

  const handleDelete = () => {
    showAlert({
      title: `Delete “${form.name}”?`,
      message: 'Removes the task and any pending grade rows it created.',
      variant: 'warning',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteForm(form.id)
            showSuccess('Removed')
            navigate('/app/quizzes')
          },
        },
      ],
    })
  }

  return (
    <>
      <TopBar
        subtitle="Edit task"
        title={form.name}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button as={Link} to={`/app/quizzes/${form.id}/share`} size="sm">
              Share
            </Button>
            <Button onClick={handleDelete} size="sm" variant="ghost">Delete</Button>
          </div>
        }
      />

      <Link to="/app/quizzes" className="tt-backLink">← All tasks</Link>

      <section className="tt-detailGrid">
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="tt-card">
            <div className="tt-sectionLabel">Title</div>
            <input
              className="tt-textField"
              value={form.name}
              onChange={(e) => renameForm(e.target.value)}
            />
          </div>

          <div className="tt-card">
            <div className="tt-sectionRow">
              <div>
                <div className="tt-sectionLabel">Questions</div>
                <div className="tt-titleSection">{questions.length} total</div>
              </div>
              <Button onClick={addQuestion} size="sm">+ Add question</Button>
            </div>

            {questions.length === 0 ? (
              <p className="tt-body">No questions yet — add one to get started.</p>
            ) : (
              <div className="tt-cardRowList">
                {questions.map((q, i) => (
                  <div key={q.id} className="tt-row">
                    <div className="tt-rowIcon tt-rowIcon-violet">{i + 1}</div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{q.title || `Question ${i + 1}`}</div>
                      <div className="tt-rowMeta">
                        {QUESTION_TYPE_LABEL[q.type] ?? 'Short answer'}
                        {q.required ? ' · Required' : ''}
                      </div>
                    </div>
                    <div className="tt-rowEnd">
                      <Button
                        as={Link}
                        to={`/app/quizzes/${form.id}/questions/${q.id}`}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button onClick={() => moveQuestion(q.id, -1)} size="sm" variant="ghost">↑</Button>
                      <Button onClick={() => moveQuestion(q.id, 1)} size="sm" variant="ghost">↓</Button>
                      <Button onClick={() => removeQuestion(q.id)} size="sm" variant="ghost">✕</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="tt-card">
            <div className="tt-sectionLabel">Where this lives</div>
            <div className="tt-titleSection">Task summary</div>
            <div className="tt-rowMeta">
              Type: <strong>{form?.answers?.taskKind ?? 'quiz'}</strong>
            </div>
            <div className="tt-rowMeta">
              Class: {cls?.name ?? 'All classes'}
            </div>
            <div className="tt-rowMeta">
              Due preset: {form?.answers?.duePreset ?? 'week'}
            </div>
            {form?.answers?.focusTopic ? (
              <div className="tt-rowMeta">Focus: {form.answers.focusTopic}</div>
            ) : null}
            <Button as={Link} to={`/app/quizzes/${form.id}/share`} className="tt-mt-12">
              Share with classes
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
