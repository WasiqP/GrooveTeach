import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

function localDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', cls: 'tt-pill-present' },
  { value: 'late', label: 'Late', cls: 'tt-pill-late' },
  { value: 'absent', label: 'Absent', cls: 'tt-pill-absent' },
]

export default function Attendance() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { classes, saveAttendance } = useClasses()
  const { showSuccess, showWarning } = usePulseAlert()

  const cls = classes.find((c) => c.id === classId)
  const [dateKey, setDateKey] = useState(localDateKey())

  // Map per-student status. Pre-fill from existing record for that day.
  const initial = useMemo(() => {
    const day = cls?.attendanceHistory?.find((d) => d.dateKey === dateKey)
    const map = {}
    for (const s of cls?.students ?? []) {
      const e = day?.entries.find((x) => x.studentId === s.id)
      map[s.id] = e?.status ?? null
    }
    return map
  }, [cls, dateKey])

  const [statusMap, setStatusMap] = useState(initial)
  // Re-sync when date or class changes
  useEffect(() => {
    setStatusMap(initial)
  }, [initial])

  if (!cls) {
    return (
      <>
        <TopBar subtitle="Attendance" title="Class not found" />
        <Button as={Link} to="/app/classes">Back to classes</Button>
      </>
    )
  }

  const counts = Object.values(statusMap).reduce(
    (acc, s) => {
      if (s === 'present') acc.present += 1
      else if (s === 'late') acc.late += 1
      else if (s === 'absent') acc.absent += 1
      else acc.unset += 1
      return acc
    },
    { present: 0, late: 0, absent: 0, unset: 0 },
  )

  const handleSave = () => {
    if (counts.unset === (cls.students?.length ?? 0)) {
      showWarning('Mark someone first', 'Tap Present, Late or Absent on at least one student.')
      return
    }
    const entries = Object.entries(statusMap)
      .filter(([, status]) => status != null)
      .map(([studentId, status]) => ({ studentId, status }))
    saveAttendance(classId, dateKey, entries)
    showSuccess('Attendance saved', `${counts.present} present · ${counts.late} late · ${counts.absent} absent`)
    navigate(`/app/classes/${classId}`)
  }

  const markAllPresent = () => {
    const map = {}
    for (const s of cls.students ?? []) map[s.id] = 'present'
    setStatusMap(map)
  }

  return (
    <>
      <TopBar
        subtitle={cls.name}
        title="Take attendance"
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={markAllPresent} size="sm" variant="outline">
              Mark all present
            </Button>
            <Button onClick={handleSave} size="sm">Save</Button>
          </div>
        }
      />

      <Link to={`/app/classes/${classId}`} className="tt-backLink">← Back to class</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-formGrid">
            <div>
              <label className="tt-fieldLabel">Date</label>
              <input
                type="date"
                className="tt-textField"
                value={dateKey}
                max={localDateKey()}
                onChange={(e) => setDateKey(e.target.value)}
              />
            </div>
            <div>
              <label className="tt-fieldLabel">Roster</label>
              <div className="tt-rowMeta">{cls.students?.length ?? 0} students</div>
            </div>
          </div>

          <div className="tt-actionsRow tt-mt-12">
            <span className="tt-pill tt-pill-present">{counts.present} present</span>
            <span className="tt-pill tt-pill-late">{counts.late} late</span>
            <span className="tt-pill tt-pill-absent">{counts.absent} absent</span>
            {counts.unset > 0 ? (
              <span className="tt-pill" style={{ background: 'var(--ink-iconWell)', color: 'var(--ink-inkSoft)' }}>
                {counts.unset} unset
              </span>
            ) : null}
          </div>
        </div>

        {(cls.students ?? []).length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">No students yet</div>
            <p className="tt-body">Add a roster on the class to take attendance.</p>
            <Button as={Link} to={`/app/classes/${classId}/students`}>Manage roster</Button>
          </div>
        ) : (
          <div className="tt-card">
            <div className="tt-sectionLabel">Roster</div>
            <div className="tt-titleSection">Who’s here today?</div>

            <div className="tt-cardRowList">
              {(cls.students ?? []).map((s) => {
                const current = statusMap[s.id]
                return (
                  <div key={s.id} className="tt-row">
                    <div className="tt-rowIcon tt-rowIcon-violet">
                      {s.rollNumber ?? s.name[0]?.toUpperCase()}
                    </div>
                    <div className="tt-rowBody">
                      <div className="tt-rowTitle">{s.name}</div>
                      <div className="tt-rowMeta">{s.email ?? 'No email'}</div>
                    </div>
                    <div className="tt-rowEnd" style={{ flexWrap: 'wrap', gap: 6 }}>
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`tt-chip ${current === opt.value ? 'tt-chip-active' : ''}`}
                          onClick={() => setStatusMap((prev) => ({ ...prev, [s.id]: opt.value }))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="tt-actionsRow">
          <Button onClick={handleSave}>Save attendance</Button>
          <Button as={Link} to={`/app/classes/${classId}`} variant="outline">
            Cancel
          </Button>
        </div>
      </section>
    </>
  )
}
