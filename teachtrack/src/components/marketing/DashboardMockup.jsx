import { motion, useReducedMotion } from 'framer-motion'
import './DashboardMockup.css'

const ROWS = [
  {
    id: 'r1',
    icon: 'A',
    tone: '',
    title: 'Posted: Quiz week reminder',
    meta: 'Mathematics 101 · just now',
    pill: 'Class',
  },
  {
    id: 'r2',
    icon: '✓',
    tone: 'is-teal',
    title: 'Attendance saved · 28 / 30 present',
    meta: 'Mathematics 101 · 2m ago',
    pill: '28/30',
    pillTone: 'is-teal',
  },
  {
    id: 'r3',
    icon: 'T',
    tone: 'is-amber',
    title: 'Assigned: Lab report — motion',
    meta: 'Physics 201 · due Fri',
    pill: 'Task',
  },
]

export default function DashboardMockup() {
  const reduce = useReducedMotion()

  const float = reduce
    ? {}
    : {
        y: [0, -8, 0],
        transition: {
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        },
      }

  const tlFloat = reduce
    ? {}
    : {
        y: [0, -6, 0],
        rotate: [-3, -1.5, -3],
        transition: { duration: 5.5, ease: 'easeInOut', repeat: Infinity },
      }

  const brFloat = reduce
    ? {}
    : {
        y: [0, 6, 0],
        rotate: [2, 0.5, 2],
        transition: { duration: 6.5, ease: 'easeInOut', repeat: Infinity },
      }

  return (
    <div className="mkt-mock" aria-hidden>
      <div className="mkt-mock-shadow" />
      <motion.div
        className="mkt-mock-stack"
        animate={float}
        initial={false}
      >
        <motion.div
          className="mkt-mock-floater is-tl"
          animate={tlFloat}
          initial={false}
        >
          <span className="mkt-mock-floater-eyebrow">AI Lesson</span>
          <span className="mkt-mock-floater-title">Drafted in 6 seconds</span>
          <span className="mkt-mock-floater-meta">Algebra · Grade 10 · 45 min</span>
        </motion.div>

        <div className="mkt-mock-card">
          <div className="mkt-mock-bar">
            <span className="mkt-mock-traffic" aria-hidden>
              <span className="mkt-mock-dot is-r" />
              <span className="mkt-mock-dot is-y" />
              <span className="mkt-mock-dot is-g" />
            </span>
            <span className="mkt-mock-tabchip">teachtrack.app/app</span>
            <span style={{ width: 32 }} />
          </div>

          <div className="mkt-mock-body">
            <div className="mkt-mock-greet">
              <h4>
                Hey <em>Maya</em>
              </h4>
              <span>Wed, 9:42 AM</span>
            </div>

            <div className="mkt-mock-stats">
              <div className="mkt-mock-stat">
                <div className="mkt-mock-stat-num">5</div>
                <div className="mkt-mock-stat-label">Classes</div>
              </div>
              <div className="mkt-mock-stat">
                <div className="mkt-mock-stat-num">142</div>
                <div className="mkt-mock-stat-label">Students</div>
              </div>
              <div className="mkt-mock-stat">
                <div className="mkt-mock-stat-num">8</div>
                <div className="mkt-mock-stat-label">Active tasks</div>
              </div>
            </div>

            <div className="mkt-mock-list">
              {ROWS.map((row, i) => (
                <motion.div
                  key={row.id}
                  className="mkt-mock-row"
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={reduce ? false : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`mkt-mock-icon ${row.tone}`}>{row.icon}</div>
                  <div>
                    <div className="mkt-mock-title">{row.title}</div>
                    <div className="mkt-mock-meta">{row.meta}</div>
                  </div>
                  <span className={`mkt-mock-pill ${row.pillTone ?? ''}`}>{row.pill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="mkt-mock-floater is-br"
          animate={brFloat}
          initial={false}
        >
          <span className="mkt-mock-floater-eyebrow">Attendance · Week</span>
          <span className="mkt-mock-floater-title">96% present</span>
          <div className="mkt-mock-attendBars" aria-hidden>
            <span style={{ height: '40%' }} />
            <span style={{ height: '60%' }} />
            <span style={{ height: '90%' }} />
            <span style={{ height: '70%' }} />
            <span style={{ height: '95%' }} />
            <span style={{ height: '88%' }} />
            <span style={{ height: '78%' }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
