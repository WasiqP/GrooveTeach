import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useForms } from '../../context/FormsContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const QUESTION_TYPES = [
  { id: 'shortText', label: 'Short answer' },
  { id: 'longText', label: 'Long answer' },
  { id: 'multipleChoice', label: 'Multiple choice' },
  { id: 'checkbox', label: 'Checkboxes' },
  { id: 'dropdown', label: 'Dropdown' },
  { id: 'rating', label: 'Rating' },
  { id: 'email', label: 'Email' },
  { id: 'number', label: 'Number' },
  { id: 'date', label: 'Date' },
]

function defaultsForType(type) {
  switch (type) {
    case 'multipleChoice':
    case 'dropdown':
      return { options: ['Option 1', 'Option 2'], correctAnswers: [] }
    case 'checkbox':
      return { options: ['Option 1', 'Option 2'], correctAnswers: [] }
    case 'rating':
      return { maxRating: 5 }
    case 'number':
      return { min: 0, max: 100, step: 1 }
    case 'date':
      return { dateFormat: 'YYYY-MM-DD' }
    default:
      return {}
  }
}

export default function QuestionsScreen() {
  const { formId, questionId } = useParams()
  const navigate = useNavigate()
  const { forms, updateForm } = useForms()
  const { showSuccess, showWarning } = usePulseAlert()

  const form = forms.find((f) => f.id === formId)
  const question = form?.answers?.questions?.find((q) => q.id === questionId)

  const [draft, setDraft] = useState(question)

  useEffect(() => {
    setDraft(question)
  }, [question?.id])

  const optionsList = useMemo(() => draft?.options ?? [], [draft])

  if (!form || !question || !draft) {
    return (
      <>
        <TopBar subtitle="Question" title="Not found" />
        <Button as={Link} to={`/app/quizzes/${formId}`}>Back to task</Button>
      </>
    )
  }

  const setField = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const setType = (type) => {
    setDraft((d) => ({ ...d, type, ...defaultsForType(type) }))
  }

  const setOption = (i, value) => {
    setField({ options: optionsList.map((o, idx) => (idx === i ? value : o)) })
  }
  const addOption = () =>
    setField({ options: [...optionsList, `Option ${optionsList.length + 1}`] })
  const removeOption = (i) => {
    setField({
      options: optionsList.filter((_, idx) => idx !== i),
      correctAnswers: (draft.correctAnswers ?? [])
        .filter((idx) => idx !== i)
        .map((idx) => (idx > i ? idx - 1 : idx)),
    })
  }
  const toggleCorrect = (i) => {
    const current = draft.correctAnswers ?? []
    if (draft.type === 'checkbox') {
      setField({
        correctAnswers: current.includes(i)
          ? current.filter((x) => x !== i)
          : [...current, i],
      })
    } else {
      setField({ correctAnswers: current.includes(i) ? [] : [i] })
    }
  }

  const handleSave = () => {
    if (!draft.title?.trim()) {
      showWarning('Title required', 'Give this question a prompt.')
      return
    }
    updateForm(form.id, (f) => ({
      answers: {
        ...(f.answers ?? {}),
        questions: (f.answers?.questions ?? []).map((q) =>
          q.id === draft.id ? { ...q, ...draft, title: draft.title.trim() } : q,
        ),
      },
    }))
    showSuccess('Saved')
    navigate(`/app/quizzes/${form.id}`)
  }

  return (
    <>
      <TopBar
        subtitle={`Editing — ${form.name}`}
        title={`Question ${(form.answers?.questions ?? []).findIndex((q) => q.id === draft.id) + 1}`}
        right={<Button onClick={handleSave} size="sm">Save question</Button>}
      />

      <Link to={`/app/quizzes/${form.id}`} className="tt-backLink">← Back to task</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Type</div>
          <div className="tt-chipRow">
            {QUESTION_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`tt-chip ${draft.type === t.id ? 'tt-chip-active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Prompt</div>
          <label className="tt-fieldLabel">Question text</label>
          <input
            className="tt-textField"
            value={draft.title ?? ''}
            onChange={(e) => setField({ title: e.target.value })}
            placeholder="What is the slope of the line y = 2x + 3?"
          />

          <label className="tt-fieldLabel tt-mt-12">Description (optional)</label>
          <textarea
            className="tt-textArea"
            value={draft.description ?? ''}
            onChange={(e) => setField({ description: e.target.value })}
            placeholder="Show your work, if you can."
          />

          <div className="tt-toggleRow tt-mt-12">
            <div>
              <div className="tt-rowTitle">Required</div>
              <div className="tt-rowMeta">Students can’t submit without answering.</div>
            </div>
            <button
              type="button"
              onClick={() => setField({ required: !draft.required })}
              className={`tt-toggle ${draft.required ? 'tt-toggle-on' : ''}`}
              aria-label="Toggle required"
            />
          </div>
        </div>

        {(draft.type === 'multipleChoice' ||
          draft.type === 'dropdown' ||
          draft.type === 'checkbox') && (
          <div className="tt-card">
            <div className="tt-sectionLabel">Options</div>
            <div className="tt-titleSection">
              {draft.type === 'checkbox' ? 'Mark all correct answers' : 'Mark the correct answer'}
            </div>
            <div className="tt-cardRowList">
              {optionsList.map((opt, i) => {
                const isCorrect = (draft.correctAnswers ?? []).includes(i)
                return (
                  <div key={i} className="tt-row">
                    <button
                      type="button"
                      className={`tt-rowIcon ${isCorrect ? 'tt-rowIcon-teal' : ''}`}
                      onClick={() => toggleCorrect(i)}
                      aria-label="Toggle correct"
                      style={{ cursor: 'pointer' }}
                    >
                      {isCorrect ? '✓' : i + 1}
                    </button>
                    <div className="tt-rowBody">
                      <input
                        className="tt-textField"
                        value={opt}
                        onChange={(e) => setOption(i, e.target.value)}
                      />
                    </div>
                    <div className="tt-rowEnd">
                      <Button onClick={() => removeOption(i)} size="sm" variant="ghost">✕</Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button onClick={addOption} size="sm" variant="outline">+ Add option</Button>
          </div>
        )}

        {draft.type === 'rating' && (
          <div className="tt-card">
            <div className="tt-sectionLabel">Scale</div>
            <label className="tt-fieldLabel">Max rating</label>
            <input
              className="tt-textField"
              type="number"
              min={2}
              max={10}
              value={draft.maxRating ?? 5}
              onChange={(e) => setField({ maxRating: Number(e.target.value) })}
            />
          </div>
        )}

        {draft.type === 'number' && (
          <div className="tt-card">
            <div className="tt-sectionLabel">Range</div>
            <div className="tt-formGrid">
              <div>
                <label className="tt-fieldLabel">Min</label>
                <input
                  className="tt-textField"
                  type="number"
                  value={draft.min ?? 0}
                  onChange={(e) => setField({ min: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="tt-fieldLabel">Max</label>
                <input
                  className="tt-textField"
                  type="number"
                  value={draft.max ?? 100}
                  onChange={(e) => setField({ max: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="tt-fieldLabel">Step</label>
                <input
                  className="tt-textField"
                  type="number"
                  value={draft.step ?? 1}
                  onChange={(e) => setField({ step: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        {draft.type === 'date' && (
          <div className="tt-card">
            <div className="tt-sectionLabel">Date</div>
            <div className="tt-formGrid">
              <div>
                <label className="tt-fieldLabel">Earliest</label>
                <input
                  className="tt-textField"
                  type="date"
                  value={draft.minDate ?? ''}
                  onChange={(e) => setField({ minDate: e.target.value })}
                />
              </div>
              <div>
                <label className="tt-fieldLabel">Latest</label>
                <input
                  className="tt-textField"
                  type="date"
                  value={draft.maxDate ?? ''}
                  onChange={(e) => setField({ maxDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <div className="tt-actionsRow">
          <Button onClick={handleSave}>Save question</Button>
          <Button as={Link} to={`/app/quizzes/${form.id}`} variant="outline">
            Cancel
          </Button>
        </div>
      </section>
    </>
  )
}
