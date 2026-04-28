import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import './Dashboard.css'

const lessons = [
  { id: 1, title: 'Linear equations · Worked examples', meta: 'Algebra · 45 mins' },
  { id: 2, title: 'Photosynthesis & light intensity', meta: 'Biology · 50 mins' },
]

export default function LessonPlanner() {
  return (
    <>
      <TopBar
        subtitle="Lessons"
        title="Plan your week"
        right={<Button size="sm">New lesson</Button>}
      />

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Upcoming</div>
          <div className="tt-titleSection">This week’s plan</div>
          <div className="tt-cardRowList">
            {lessons.map((l) => (
              <div className="tt-row" key={l.id}>
                <div className="tt-rowIcon">L</div>
                <div className="tt-rowBody">
                  <div className="tt-rowTitle">{l.title}</div>
                  <div className="tt-rowMeta">{l.meta}</div>
                </div>
                <Button size="sm" variant="secondary">Open</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
