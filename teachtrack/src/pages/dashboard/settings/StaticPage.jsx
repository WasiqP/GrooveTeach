import TopBar from '../../../components/layout/TopBar'
import './../Dashboard.css'

export default function StaticPage({ subtitle, title, body }) {
  return (
    <>
      <TopBar subtitle={subtitle} title={title} />

      <section className="tt-dashSection">
        <div className="tt-card">
          <p className="tt-body" style={{ whiteSpace: 'pre-line' }}>
            {body}
          </p>
        </div>
      </section>
    </>
  )
}
