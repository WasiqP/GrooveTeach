import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses, SCHOOL_TYPES } from '../../context/ClassesContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

const GRADES_BY_TYPE = {
  School: [
    'Kindergarten',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12',
  ],
  College: ['1st year', '2nd year', '3rd year', '4th year', 'Graduate / PG', 'Certificate / Diploma'],
  University: ['UG — Year 1', 'Year 2', 'Year 3', 'Year 4 / Honours', "Master's", 'Doctoral', 'Postdoctoral'],
  Others: ['General', 'Mixed levels', 'Adult / continuing education', 'Professional', 'Not specified'],
}

const WEEK_CHIPS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
]

const DAY_LABEL = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' }

function parseRosterText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const out = []
  let nextRoll = 1
  for (const line of lines) {
    const parts = line.split(/[,\t]/).map((p) => p.trim()).filter(Boolean)
    if (parts.length === 0) continue
    let roll
    let name
    let email
    if (parts.length === 1) {
      roll = String(nextRoll).padStart(2, '0')
      name = parts[0]
    } else if (parts.length === 2) {
      // "01, Alex" OR "Alex, alex@x.com"
      if (/^\d/.test(parts[0])) {
        roll = parts[0]
        name = parts[1]
      } else {
        roll = String(nextRoll).padStart(2, '0')
        name = parts[0]
        email = parts[1]
      }
    } else {
      roll = parts[0]
      name = parts[1]
      email = parts[2]
    }
    if (!name) continue
    out.push({
      id: `st-${Date.now()}-${out.length}`,
      rollNumber: roll,
      name,
      email,
    })
    nextRoll++
  }
  return out
}

export default function CreateClass() {
  const navigate = useNavigate()
  const { addClass } = useClasses()
  const { showWarning, showSuccess } = usePulseAlert()

  const [schoolType, setSchoolType] = useState('School')
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [days, setDays] = useState([1, 3, 5])
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [rosterText, setRosterText] = useState('')

  const gradeOptions = useMemo(() => GRADES_BY_TYPE[schoolType], [schoolType])

  const toggleDay = (id) =>
    setDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id].sort()))

  const formatSchedule = () => {
    const sorted = [...new Set(days)].sort((a, b) => a - b)
    const dayPart = sorted.map((id) => DAY_LABEL[id]).join(', ')
    const t = (s) => {
      const [h, m] = s.split(':').map(Number)
      const date = new Date()
      date.setHours(h, m)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    return `${dayPart} · ${t(startTime)} – ${t(endTime)}`
  }

  const handleCreate = () => {
    if (!name.trim() || !subject.trim() || !gradeLevel) {
      showWarning('Missing details', 'Class name, subject and grade level are required.')
      return
    }
    if (days.length === 0) {
      showWarning('Pick at least one day', 'TeeTee needs to know when this class meets.')
      return
    }
    const students = parseRosterText(rosterText)
    const id = `cls-${Date.now()}`
    addClass({
      id,
      name: name.trim(),
      subject: subject.trim(),
      gradeLevel,
      schoolName: schoolName.trim() || undefined,
      schoolType,
      roomNumber: roomNumber.trim() || undefined,
      schedule: formatSchedule(),
      students,
      announcements: [],
      activityLog: [
        {
          id: `act-init-${id}`,
          kind: 'announcement',
          headline: 'Class created',
          detail: `${students.length} student${students.length === 1 ? '' : 's'} added to roster.`,
          createdAt: new Date().toISOString(),
        },
      ],
      attendanceHistory: [],
      reminder: null,
      createdAt: new Date().toISOString(),
    })
    showSuccess('Class created', 'TeeTee has it ready to go.')
    navigate(`/app/classes/${id}`)
  }

  return (
    <>
      <TopBar
        subtitle="Classes"
        title="Create a class"
        right={
          <Button as={Link} to="/app/classes" size="sm" variant="outline">
            Back to list
          </Button>
        }
      />

      <Link to="/app/classes" className="tt-backLink">← All classes</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Step 1</div>
          <div className="tt-titleSection">Where is this class taught?</div>
          <div className="tt-chipRow">
            {SCHOOL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSchoolType(t)
                  setGradeLevel('')
                }}
                className={`tt-chip ${schoolType === t ? 'tt-chip-active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 2</div>
          <div className="tt-titleSection">The basics</div>
          <div className="tt-formGrid">
            <div>
              <label className="tt-fieldLabel">Class name</label>
              <input
                className="tt-textField"
                placeholder="e.g. Mathematics 101"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="tt-fieldLabel">Subject</label>
              <input
                className="tt-textField"
                placeholder="e.g. Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="tt-fieldLabel">Grade / level</label>
              <select
                className="tt-textField"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="">Select…</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="tt-fieldLabel">Room (optional)</label>
              <input
                className="tt-textField"
                placeholder="e.g. Room 205"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="tt-fieldLabel">{schoolType} name (optional)</label>
              <input
                className="tt-textField"
                placeholder="e.g. Westside Academy"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 3</div>
          <div className="tt-titleSection">When does this class meet?</div>
          <div className="tt-chipRow">
            {WEEK_CHIPS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDay(d.id)}
                className={`tt-chip ${days.includes(d.id) ? 'tt-chip-active' : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="tt-formGrid tt-mt-12">
            <div>
              <label className="tt-fieldLabel">Start time</label>
              <input
                type="time"
                className="tt-textField"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="tt-fieldLabel">End time</label>
              <input
                type="time"
                className="tt-textField"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="tt-card">
          <div className="tt-sectionLabel">Step 4</div>
          <div className="tt-titleSection">Add the roster (optional)</div>
          <p className="tt-body">
            Paste one student per line. Supported formats:
          </p>
          <ul className="tt-body" style={{ marginTop: 0, paddingLeft: 18 }}>
            <li><code>Alex Morgan</code></li>
            <li><code>01, Alex Morgan</code></li>
            <li><code>01, Alex Morgan, alex@school.edu</code></li>
          </ul>
          <textarea
            className="tt-textArea"
            placeholder={'01, Alex Morgan, alex@school.edu\n02, Jordan Lee, jordan@school.edu'}
            value={rosterText}
            onChange={(e) => setRosterText(e.target.value)}
            style={{ minHeight: 140 }}
          />
          <div className="tt-fieldHint">
            {parseRosterText(rosterText).length} students will be added.
          </div>
        </div>

        <div className="tt-actionsRow">
          <Button onClick={handleCreate}>Create class</Button>
          <Button as={Link} to="/app/classes" variant="outline">
            Cancel
          </Button>
        </div>
      </section>
    </>
  )
}
