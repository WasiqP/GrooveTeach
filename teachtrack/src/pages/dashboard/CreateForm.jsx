import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { useForms } from '../../context/FormsContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const TASK_TYPES = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'test', label: 'Test' },
  { id: 'project', label: 'Project' },
  { id: 'survey', label: 'Survey' },
]

const DUE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'This week' },
  { id: 'two_weeks', label: '2 weeks' },
  { id: 'month', label: 'Month' },
  { id: 'custom', label: 'Later' },
]

const FORMAT_OPTIONS = [
  { id: 'multiple_choice', label: 'Multi choice' },
  { id: 'true_false', label: 'True / false' },
  { id: 'short_answer', label: 'Short' },
  { id: 'essay', label: 'Essay' },
  { id: 'matching', label: 'Match' },
  { id: 'mix', label: 'Mix' },
]

const ICON_IDS = ['clipboard', 'star', 'message', 'chart', 'target', 'trophy']

export default function CreateForm() {
  const navigate = useNavigate()
  const { classes } = useClasses()
  const { addForm } = useForms()
  const { showWarning, showSuccess } = usePulseAlert()

  const [taskKind, setTaskKind] = useState('quiz')
  const [classId, setClassId] = useState(classes[0]?.id ?? 'all')
  const [title, setTitle] = useState('')
  const [focusTopic, setFocusTopic] = useState('')
  const [duePreset, setDuePreset] = useState('week')
  const [formatIds, setFormatIds] = useState(['multiple_choice'])
  const [iconId, setIconId] = useState('clipboard')

  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  )

  const toggleFormat = (id) =>
    setFormatIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleCreate = () => {
    if (classes.length === 0) {
      showWarning('Add a class first', 'Create a class, then you can attach a task.')
      return
    }
    if (!title.trim()) {
      showWarning('Name required', 'Give your task a title so you can find it later.')
      return
    }

    const id = `${Date.now()}`
    const starterQuestion = {
      id: 'q1',
      title: 'Question 1',
      type: 'shortText',
      required: false,
    }

    addForm({
      id,
      name: title.trim(),
      iconId,
      answers: {
        taskKind,
        classId,
        focusTopic: focusTopic.trim(),
        duePreset,
        formatIds,
        questions: [starterQuestion],
      },
      createdAt: new Date().toISOString(),
    })

    showSuccess('Task created', 'Now build out the questions.')
    navigate(`/app/quizzes/${id}`)
  }

  return (
    <>
      <TopBar
        subtitle="New task"
        title="Build a quiz, assignment or test"
        right={
          <Button as={Link} to="/app/quizzes" size="sm" variant="outline">
            Cancel
          </Button>
        }
      />

      <Link to="/app/quizzes" className="tt-backLink">← All tasks</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Step 1</div>
          <div className="tt-titleSection">What kind of task?</div>
          <div className="tt-chipRow">
            {TASK_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTaskKind(t.id)}
                className={`tt-chip ${taskKind === t.id ? 'tt-chip-active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 2</div>
          <div className="tt-titleSection">For which class?</div>
          <select
            className="tt-textField"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            {sortedClasses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="all">All classes</option>
          </select>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 3</div>
          <div className="tt-titleSection">The basics</div>
          <div className="tt-formGrid">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="tt-fieldLabel">Title</label>
              <input
                className="tt-textField"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Algebra Unit 2 quiz"
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="tt-fieldLabel">Focus topic (optional)</label>
              <input
                className="tt-textField"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                placeholder="e.g. Quadratic equations"
              />
            </div>
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 4</div>
          <div className="tt-titleSection">When is it due?</div>
          <div className="tt-chipRow">
            {DUE_OPTIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDuePreset(d.id)}
                className={`tt-chip ${duePreset === d.id ? 'tt-chip-active' : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 5</div>
          <div className="tt-titleSection">Question formats you’ll use</div>
          <p className="tt-body">Pick a few. You can mix and match per question.</p>
          <div className="tt-chipRow">
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFormat(f.id)}
                className={`tt-chip ${formatIds.includes(f.id) ? 'tt-chip-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 6</div>
          <div className="tt-titleSection">Pick an icon</div>
          <div className="tt-chipRow">
            {ICON_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setIconId(id)}
                className={`tt-chip ${iconId === id ? 'tt-chip-active' : ''}`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-actionsRow">
          <Button onClick={handleCreate}>Create task</Button>
          <Button as={Link} to="/app/quizzes" variant="outline">Cancel</Button>
        </div>
      </section>
    </>
  )
}
