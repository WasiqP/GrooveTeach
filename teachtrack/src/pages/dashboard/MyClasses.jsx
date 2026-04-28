import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import './Dashboard.css'

export default function MyClasses() {
  const { classes } = useClasses()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return classes
    return classes.filter((c) =>
      [c.name, c.subject, c.gradeLevel, c.schoolName, c.roomNumber]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(q)),
    )
  }, [classes, query])

  return (
    <>
      <TopBar
        subtitle="My Classes"
        title="Your classes"
        right={
          <Button as={Link} to="/app/classes/new" size="sm">
            Create class
          </Button>
        }
      />

      <section className="tt-dashSection">
        <div className="tt-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search by name, subject or grade…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="tt-dashSection">
        <div className="tt-cardGrid">
          {filtered.map((c) => (
            <Link key={c.id} to={`/app/classes/${c.id}`} className="tt-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="tt-sectionLabel">{c.subject}</div>
              <div className="tt-titleSection">{c.name}</div>
              <div className="tt-rowMeta">
                {c.gradeLevel}
                {c.schoolName ? ` · ${c.schoolName}` : ''}
              </div>
              <div className="tt-rowMeta">{c.schedule}</div>
              <div className="tt-actionsRow tt-mt-8">
                <span className="tt-pill tt-pill-quiz">{c.students?.length ?? 0} students</span>
                {c.roomNumber ? (
                  <span className="tt-pill tt-pill-assignment">{c.roomNumber}</span>
                ) : null}
              </div>
            </Link>
          ))}

          <Link to="/app/classes/new" className="tt-card tt-emptyCard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="tt-titleSection">+ New class</div>
            <p className="tt-body">Group your students and build a focused space.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
