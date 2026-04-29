import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Button from '../ui/Button'
import AnimatedText from './AnimatedText'
import Logo from '../ui/Logo'
import './HeroSection.css'

const TASK_ROWS = [
  { id: 'r1', title: 'Motion Quiz · Class 10A', due: 'Due in 2h', status: 'Published' },
  { id: 'r2', title: 'Attendance · Mathematics 101', due: 'Live now', status: '28 / 30' },
  { id: 'r3', title: 'AI lesson draft · Algebra', due: 'Ready to review', status: 'Drafted' },
]

export default function HeroSection() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const visualY = useTransform(scrollY, [0, 700], [0, 54])

  return (
    <section className="mkt-hero">
      <div className="mkt-aurora" aria-hidden />
      <div className="mkt-grid-bg" aria-hidden />

      <div className="mkt-hero-shell">
        <div className="mkt-hero-stage">
          <div className="mkt-hero-grid">
            <div className="mkt-hero-copy">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="mkt-eyebrow">
                  <span className="mkt-eyebrow-dot" aria-hidden />
                  Built for teachers · Powered by AI
                </span>
              </motion.div>

              <AnimatedText
                as="h1"
                className="mkt-display"
                text="Run Your Classroom Like Clockwork"
                highlight={['Classroom', 'Clockwork']}
                stagger={0.07}
                delay={0.1}
              />

              <motion.p
                className="mkt-lede"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                TeachTrack quietly handles classes, attendance, quizzes, homework,
                and grading - so teachers spend more time teaching and less time
                on admin. Calm, fast, and ready when you are.
              </motion.p>

              <motion.div
                className="mkt-hero-cta-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button as={Link} to="/signup" className="mkt-btn-glow">
                  Get started - free
                </Button>
                <Button as={Link} to="/app" variant="secondary">
                  View live demo
                </Button>
              </motion.div>

              <motion.div
                className="mkt-hero-trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.95 }}
              >
                <span className="mkt-hero-avatars" aria-hidden>
                  <span>MK</span>
                  <span>JL</span>
                  <span>SR</span>
                  <span>+</span>
                </span>
                <span className="mkt-hero-trust-text">
                  <strong>1,200+ teachers</strong> already saving 6 hrs / week
                </span>
              </motion.div>
            </div>

            <motion.div
              className="mkt-hero-visual"
              style={reduce ? undefined : { y: visualY }}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mkt-hero-product-shell">
                <div className="mkt-hero-product-header">
                  <div className="mkt-hero-product-brand">
                    <Logo size={24} />
                    <span>TeachTrack Workspace</span>
                  </div>
                  <span className="mkt-hero-product-chip">Live preview</span>
                </div>

                <div className="mkt-hero-product-kpis">
                  <div className="mkt-hero-kpi">
                    <strong>5</strong>
                    <span>Classes</span>
                  </div>
                  <div className="mkt-hero-kpi">
                    <strong>142</strong>
                    <span>Students</span>
                  </div>
                  <div className="mkt-hero-kpi">
                    <strong>8</strong>
                    <span>Tasks</span>
                  </div>
                </div>

                <div className="mkt-hero-panel-list">
                  {TASK_ROWS.map((row) => (
                    <div key={row.id} className="mkt-hero-row">
                      <div>
                        <h3>{row.title}</h3>
                        <p>{row.due}</p>
                      </div>
                      <span>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.article
                className="mkt-hero-side-note is-top"
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>AI precision</span>
                <strong>Lesson plan drafted in 6s</strong>
              </motion.article>

              <motion.article
                className="mkt-hero-side-note is-bottom"
                animate={reduce ? undefined : { y: [0, 7, 0] }}
                transition={reduce ? undefined : { duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>Class pulse</span>
                <strong>96% attendance this week</strong>
              </motion.article>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mkt-hero-cap-strip"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="mkt-hero-cap-strip-inner" role="list" aria-label="Core capabilities">
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-violet">C</i>
              <span>Classes</span>
            </span>
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-teal">✓</i>
              <span>Attendance</span>
            </span>
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-amber">Q</i>
              <span>Quizzes &amp; tasks</span>
            </span>
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-indigo">H</i>
              <span>Homework</span>
            </span>
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-violet">AI</i>
              <span>Lesson plans</span>
            </span>
            <span className="mkt-hero-cap" role="listitem">
              <i aria-hidden className="mkt-hero-cap-ico is-teal">R</i>
              <span>Reports</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
