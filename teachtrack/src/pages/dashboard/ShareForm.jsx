import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useForms } from '../../context/FormsContext'
import { useClasses } from '../../context/ClassesContext'
import { useGradesTasks } from '../../context/GradesTasksContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const KIND_LABEL = { quiz: 'Quiz', assignment: 'Assignment', test: 'Test', project: 'Project' }

function mapFormKindToTaskKind(raw) {
  if (raw === 'quiz' || raw === 'assignment' || raw === 'test' || raw === 'project') return raw
  return 'quiz'
}

function computeDueFromPreset(ref, duePreset) {
  const end = new Date(ref.getTime())
  const endOfDay = () => end.setHours(23, 59, 59, 999)
  switch (duePreset) {
    case 'today':
      endOfDay()
      return { dueLabel: 'Due today', dueAt: end.toISOString() }
    case 'tomorrow':
      end.setDate(end.getDate() + 1)
      endOfDay()
      return { dueLabel: 'Due tomorrow', dueAt: end.toISOString() }
    case 'week': {
      const dow = end.getDay()
      const daysUntilSun = dow === 0 ? 0 : 7 - dow
      end.setDate(end.getDate() + daysUntilSun)
      endOfDay()
      return { dueLabel: 'Due this week', dueAt: end.toISOString() }
    }
    case 'two_weeks':
      end.setDate(end.getDate() + 14)
      endOfDay()
      return { dueLabel: 'Due in 2 wks', dueAt: end.toISOString() }
    case 'month':
      end.setMonth(end.getMonth() + 1)
      endOfDay()
      return { dueLabel: 'Due next month', dueAt: end.toISOString() }
    default:
      end.setDate(end.getDate() + 7)
      endOfDay()
      return { dueLabel: 'Due in ~1 wk', dueAt: end.toISOString() }
  }
}

export default function ShareForm() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const { forms } = useForms()
  const { classes, logTaskAssigned } = useClasses()
  const { assignFormToClasses } = useGradesTasks()
  const { showAlert, showSuccess, showError } = usePulseAlert()

  const form = forms.find((f) => f.id === formId)
  const [tab, setTab] = useState('classes')
  const [selectedClassIds, setSelectedClassIds] = useState(new Set())
  const [linkCopied, setLinkCopied] = useState(false)

  const formLink = `https://teachtrack.app/form/${formId}`

  const taskKind = useMemo(
    () => mapFormKindToTaskKind(form?.answers?.taskKind),
    [form],
  )

  if (!form) {
    return (
      <>
        <TopBar subtitle="Share" title="Task not found" />
        <Button as={Link} to="/app/quizzes">Back to tasks</Button>
      </>
    )
  }

  const toggleClass = (id) => {
    setSelectedClassIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedClassIds(new Set(classes.map((c) => c.id)))
  }
  const clearAll = () => setSelectedClassIds(new Set())

  const handleAssign = () => {
    if (selectedClassIds.size === 0) {
      showAlert({
        title: 'Pick at least one class',
        message: 'Tick the classes you want to share this task with.',
        variant: 'warning',
      })
      return
    }

    const targets = []
    for (const cls of classes) {
      if (!selectedClassIds.has(cls.id)) continue
      targets.push({
        classId: cls.id,
        studentIds: (cls.students ?? []).map((s) => s.id),
      })
    }

    const { dueLabel, dueAt } = computeDueFromPreset(
      new Date(),
      form?.answers?.duePreset ?? 'week',
    )

    try {
      assignFormToClasses({
        formId: form.id,
        title: form.name,
        kind: taskKind,
        dueLabel,
        dueAt,
        targets,
      })

      // Append a class activity entry per target.
      for (const t of targets) {
        const cls = classes.find((c) => c.id === t.classId)
        logTaskAssigned(
          t.classId,
          'Task assigned',
          `${form.name} · ${KIND_LABEL[taskKind]} · ${t.studentIds.length} student${
            t.studentIds.length === 1 ? '' : 's'
          }`,
        )
        void cls
      }

      showSuccess(
        'Task shared',
        `Pending grade rows added in ${targets.length} class${targets.length === 1 ? '' : 'es'}.`,
      )
      navigate('/app/grades')
    } catch (err) {
      showError('Could not share', err?.message ?? 'Try again in a moment.')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(formLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 1800)
    } catch {
      showError('Copy failed', 'Your browser blocked clipboard access.')
    }
  }

  // Use the QR Server API for a quick QR without bundling a lib.
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(formLink)}`

  return (
    <>
      <TopBar
        subtitle={`Share — ${KIND_LABEL[taskKind]}`}
        title={form.name}
        right={
          <Button as={Link} to={`/app/quizzes/${form.id}`} size="sm" variant="outline">
            Back to edit
          </Button>
        }
      />

      <Link to="/app/quizzes" className="tt-backLink">← All tasks</Link>

      <section className="tt-dashSection">
        <div className="tt-tabsRow">
          {[
            { key: 'classes', label: 'Classes' },
            { key: 'link', label: 'Link' },
            { key: 'qr', label: 'QR code' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              className={`tt-tab ${tab === t.key ? 'tt-tab-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {tab === 'classes' ? (
        <>
          <section className="tt-dashSection">
            <div className="tt-card">
              <div className="tt-sectionRow">
                <div>
                  <div className="tt-sectionLabel">Classes</div>
                  <div className="tt-titleSection">Send to which classes?</div>
                </div>
                <div className="tt-actionsRow">
                  <Button onClick={selectAll} size="sm" variant="outline">Select all</Button>
                  <Button onClick={clearAll} size="sm" variant="ghost">Clear</Button>
                </div>
              </div>

              {classes.length === 0 ? (
                <p className="tt-body">Create a class first, then come back to share.</p>
              ) : (
                <div className="tt-cardRowList">
                  {classes.map((c) => {
                    const checked = selectedClassIds.has(c.id)
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className="tt-row tt-rowLink"
                        onClick={() => toggleClass(c.id)}
                        style={{ background: 'transparent', border: 0, textAlign: 'left' }}
                      >
                        <div className={`tt-rowIcon ${checked ? 'tt-rowIcon-teal' : ''}`}>
                          {checked ? '✓' : (c.students?.length ?? 0)}
                        </div>
                        <div className="tt-rowBody">
                          <div className="tt-rowTitle">{c.name}</div>
                          <div className="tt-rowMeta">
                            {(c.students?.length ?? 0)} student{(c.students?.length ?? 0) === 1 ? '' : 's'}
                          </div>
                        </div>
                        <div className="tt-rowEnd">
                          <span className={`tt-pill ${checked ? 'tt-pill-graded' : 'tt-pill-pending'}`}>
                            {checked ? 'Selected' : 'Tap to select'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <div className="tt-actionsRow">
            <Button onClick={handleAssign}>Assign task</Button>
            <Button as={Link} to={`/app/quizzes/${form.id}`} variant="outline">Cancel</Button>
          </div>
        </>
      ) : null}

      {tab === 'link' ? (
        <section className="tt-dashSection">
          <div className="tt-card">
            <div className="tt-sectionLabel">Link</div>
            <div className="tt-titleSection">Copy & paste</div>
            <p className="tt-body">Share this link wherever your students hang out.</p>
            <div className="tt-search">
              <span className="tt-rowMeta" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formLink}
              </span>
              <Button onClick={copyLink} size="sm">{linkCopied ? 'Copied!' : 'Copy link'}</Button>
            </div>
            <div className="tt-actionsRow tt-mt-12">
              <Button
                as="a"
                href={`https://wa.me/?text=${encodeURIComponent(`${form.name} — ${formLink}`)}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
              >
                Share to WhatsApp
              </Button>
              <Button
                as="a"
                href={`mailto:?subject=${encodeURIComponent(form.name)}&body=${encodeURIComponent(formLink)}`}
                variant="outline"
              >
                Email
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {tab === 'qr' ? (
        <section className="tt-dashSection">
          <div className="tt-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className="tt-sectionLabel">QR code</div>
            <div className="tt-titleSection">Scan with a phone</div>
            <img
              src={qrSrc}
              alt="QR code linking to this task"
              width={240}
              height={240}
              style={{ borderRadius: 16, border: '2px solid var(--ink-borderInk)', background: '#fff', padding: 8 }}
            />
            <div className="tt-rowMeta">{formLink}</div>
            <Button onClick={copyLink}>{linkCopied ? 'Copied!' : 'Copy link'}</Button>
          </div>
        </section>
      ) : null}
    </>
  )
}
