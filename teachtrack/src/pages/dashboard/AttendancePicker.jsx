import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useClasses } from '../../context/ClassesContext'
import './Dashboard.css'

export default function AttendancePicker() {
  const { classes } = useClasses()

  return (
    <>
      <TopBar
        subtitle="Attendance"
        title="Pick a class"
        right={<Button as={Link} to="/app/classes/new" size="sm" variant="outline">New class</Button>}
      />

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Quick attendance</div>
          <div className="tt-titleSection">Which class is in front of you?</div>
          <p className="tt-body">Pick a class to start marking present, late or absent.</p>
        </div>

        {classes.length === 0 ? (
          <div className="tt-card tt-emptyCard">
            <div className="tt-titleSection">No classes yet</div>
            <p className="tt-body">Create a class first, then come back to take attendance.</p>
            <Button as={Link} to="/app/classes/new">Create a class</Button>
          </div>
        ) : (
          <div className="tt-cardGrid">
            {classes.map((c) => (
              <Link
                key={c.id}
                to={`/app/classes/${c.id}/attendance`}
                className="tt-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="tt-sectionLabel">{c.subject}</div>
                <div className="tt-titleSection">{c.name}</div>
                <div className="tt-rowMeta">{c.schedule}</div>
                <div className="tt-actionsRow tt-mt-8">
                  <span className="tt-pill tt-pill-quiz">{c.students?.length ?? 0} students</span>
                  <span className="tt-pill tt-pill-assignment">
                    {c.attendanceHistory?.length ?? 0} days recorded
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
