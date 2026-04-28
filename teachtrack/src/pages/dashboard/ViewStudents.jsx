import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

export default function ViewStudents() {
  const { classId } = useParams()
  const { classes, updateClass } = useClasses()
  const { showSuccess, showWarning } = usePulseAlert()

  const cls = classes.find((c) => c.id === classId)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [newRoll, setNewRoll] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const filtered = useMemo(() => {
    const list = cls?.students ?? []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((s) =>
      [s.name, s.rollNumber, s.email].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [cls, query])

  if (!cls) {
    return (
      <>
        <TopBar subtitle="Roster" title="Class not found" />
        <Button as={Link} to="/app/classes">Back to classes</Button>
      </>
    )
  }

  const addStudent = () => {
    if (!newName.trim()) {
      showWarning('Name required', 'A student needs a name.')
      return
    }
    const next = {
      id: `st-${Date.now()}`,
      rollNumber: newRoll.trim() || String((cls.students?.length ?? 0) + 1).padStart(2, '0'),
      name: newName.trim(),
      email: newEmail.trim() || undefined,
    }
    updateClass(classId, { students: [...(cls.students ?? []), next] })
    setNewRoll('')
    setNewName('')
    setNewEmail('')
    setAdding(false)
    showSuccess('Student added')
  }

  const removeStudent = (studentId) => {
    updateClass(classId, {
      students: (cls.students ?? []).filter((s) => s.id !== studentId),
    })
  }

  return (
    <>
      <TopBar
        subtitle={cls.name}
        title="Student roster"
        right={
          <Button onClick={() => setAdding((v) => !v)} size="sm">
            {adding ? 'Cancel' : '+ Add student'}
          </Button>
        }
      />

      <Link to={`/app/classes/${classId}`} className="tt-backLink">← Back to class</Link>

      <section className="tt-dashSection">
        <div className="tt-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search students…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {adding ? (
          <div className="tt-card">
            <div className="tt-titleSection">Add a student</div>
            <div className="tt-formGrid">
              <div>
                <label className="tt-fieldLabel">Roll #</label>
                <input
                  className="tt-textField"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  placeholder="01"
                />
              </div>
              <div>
                <label className="tt-fieldLabel">Name</label>
                <input
                  className="tt-textField"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Alex Morgan"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="tt-fieldLabel">Email (optional)</label>
                <input
                  className="tt-textField"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="alex@school.edu"
                />
              </div>
            </div>
            <div className="tt-actionsRow">
              <Button onClick={addStudent}>Add to roster</Button>
            </div>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">No students match</div>
            <p className="tt-body">Try clearing the search or add a new student.</p>
          </div>
        ) : (
          <div className="tt-card">
            <div className="tt-sectionLabel">Roster</div>
            <div className="tt-titleSection">{filtered.length} students</div>
            <div className="tt-cardRowList">
              {filtered.map((s) => (
                <div key={s.id} className="tt-row">
                  <div className="tt-rowIcon tt-rowIcon-violet">{s.rollNumber ?? s.name[0]?.toUpperCase()}</div>
                  <div className="tt-rowBody">
                    <div className="tt-rowTitle">{s.name}</div>
                    <div className="tt-rowMeta">{s.email ?? 'No email'}</div>
                    {s.followUp ? (
                      <span className="tt-pill tt-pill-late tt-mt-8">Follow up</span>
                    ) : null}
                  </div>
                  <div className="tt-rowEnd">
                    <Button
                      as={Link}
                      to={`/app/classes/${classId}/students/${s.id}`}
                      size="sm"
                      variant="outline"
                    >
                      Open
                    </Button>
                    <Button onClick={() => removeStudent(s.id)} size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
