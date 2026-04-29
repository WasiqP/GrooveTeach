import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '../../components/ui/Button'
import HeroSection from '../../components/marketing/HeroSection'
import SectionHeading from '../../components/marketing/SectionHeading'
import FeatureCard from '../../components/marketing/FeatureCard'
import TestimonialCard from '../../components/marketing/TestimonialCard'
import Reveal from '../../components/marketing/Reveal'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

function IconClasses() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M4 16h13a3 3 0 0 1 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconAttendance() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="6" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="m9 13 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconQuiz() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path
        d="M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconAI() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 13.5 8 18 9.5 13.5 11 12 16 10.5 11 6 9.5 10.5 8 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m18 16 .8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHomework() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 14 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconReports() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V8M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconApple() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16.7 13.2c0 3 2.6 4 2.6 4s-1.9 5.5-4.6 5.5c-1.2 0-2.1-.7-3.4-.7s-2.3.7-3.6.7C5.1 22.7 2 17.8 2 13.7 2 9.7 4.6 7.5 7 7.5c1.3 0 2.5.8 3.3.8.8 0 2.3-.9 3.9-.9.6 0 2.7.1 4 2-.1.1-2.4 1.4-2.4 3.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14.9 2c.2 1.5-.5 3-1.4 4-.9 1-2.4 1.8-3.8 1.7-.2-1.4.6-2.9 1.5-3.9.9-1 2.5-1.8 3.7-1.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGooglePlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 3.6v16.8c0 1 .9 1.6 1.8 1l11.2-7.2c.9-.6.9-1.9 0-2.5L6.8 2.6C5.9 2 5 2.6 5 3.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M6.7 5.2 14 12 6.7 18.8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 12l3.7-2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 12l3.7 2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12.1 2 2 3.8-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="6" y="11" width="12" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 15v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCloud() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.5 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.2 8.4 4.5 4.5 0 0 0 7.5 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 18c0-2.2-1.8-4-4-4s-4 1.8-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M20 18c0-1.6-1-3-2.4-3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17.7 6.8a3.2 3.2 0 0 1 0 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const TESTIMONIALS = [
  {
    quote:
      "I used to spend Sunday nights re-typing lesson plans. With TeachTrack I draft a week of plans in 20 minutes — and attendance is one tap.",
    name: 'Maya Khoury',
    role: 'Maths · Year 10, Westside Academy',
    avatarColor: '#a060ff',
  },
  {
    quote:
      'Quizzes, share links, auto-grade — finally one place that fits how I actually teach. The team built this for teachers, not for admin software demos.',
    name: 'Jordan Lee',
    role: 'English Lit · Lakefield High',
    avatarColor: '#0d9488',
  },
  {
    quote:
      'Two principals at our school adopted it after one term. The attendance heatmap alone has changed how we run interventions.',
    name: 'Dr. Aisha Patel',
    role: 'Head of Science · Brightford College',
    avatarColor: '#d97706',
  },
]

export default function MarketingHome() {
  const WORKFLOW = [
    {
      key: 'plan',
      tone: 'violet',
      icon: <IconAI />,
      kicker: 'Plan',
      title: 'Draft lessons in your voice.',
      body: 'Start from a topic and grade. TeachTrack drafts objectives and activities — you edit and reuse.',
      bullets: ['Reusable templates', 'Resource attachments', 'Notes with context'],
    },
    {
      key: 'teach',
      tone: 'teal',
      icon: <IconAttendance />,
      kicker: 'Teach',
      title: 'Run class in the moment.',
      body: 'Mark attendance fast, capture quick notes, and keep everything tied to the right class.',
      bullets: ['One‑tap attendance', 'Week history', 'Follow‑ups'],
    },
    {
      key: 'measure',
      tone: 'amber',
      icon: <IconReports />,
      kicker: 'Measure',
      title: 'Share progress cleanly.',
      body: 'Turn daily work into a readable snapshot for parents and admins — export whenever you need.',
      bullets: ['Per‑student summaries', 'Export ready', 'Term‑friendly'],
    },
  ]

  function scrollToFeatures() {
    const el = document.getElementById('features')
    if (!el) return
    const lenis = window.__teachtrack_lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset: -90 })
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const workflowRef = useRef(null)
  const [persona, setPersona] = useState('teacher')
  const howVideoRef = useRef(null)
  const personaPausedRef = useRef(false)
  const personaLastSwitchRef = useRef(Date.now())

  // Premium "workflow canvas" reveal (lighter than sticky scroll-story)
  useEffect(() => {
    const el = workflowRef.current
    if (!el) return undefined

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) return undefined

    const lenis = typeof window !== 'undefined' ? window.__teachtrack_lenis : null
    if (lenis && !lenis.__teachtrackScrollSyncBound) {
      lenis.on('scroll', ScrollTrigger.update)
      ScrollTrigger.refresh()
      lenis.__teachtrackScrollSyncBound = true
    }

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('[data-workflow-card]')
      gsap.set(cards, { opacity: 0, y: 22 })
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  // Scroll-zoom effect for the walkthrough video card
  useEffect(() => {
    const el = howVideoRef.current
    if (!el) return undefined

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) return undefined

    const lenis = typeof window !== 'undefined' ? window.__teachtrack_lenis : null
    if (lenis && !lenis.__teachtrackScrollSyncBound) {
      // Lenis already runs its own rAF loop via useLenis().
      // We only need ScrollTrigger to update when Lenis scrolls.
      lenis.on('scroll', ScrollTrigger.update)
      ScrollTrigger.refresh()
      lenis.__teachtrackScrollSyncBound = true
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { transformOrigin: '50% 50%', willChange: 'transform' })
      gsap.fromTo(
        el,
        { scale: 0.965, y: 10 },
        {
          scale: 1.03,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 35%',
            scrub: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  function setPersonaFromUser(next) {
    personaLastSwitchRef.current = Date.now()
    setPersona(next)
  }

  return (
    <>
      <HeroSection />

      <section className="mkt-proofbar" aria-label="Social proof">
        <div className="mkt-shell">
          <div className="mkt-proofbar-wrap">
            <Reveal>
              <div className="mkt-proofbar-kicker">Trusted by educators and teams who value calm workflows</div>
            </Reveal>
            <div className="mkt-proofbar-logos" aria-label="Logos">
              {['Westside Academy', 'Lakefield High', 'Brightford College', 'Northview School', 'Cedar Grove', 'Summit Prep'].map((name, i) => (
                <Reveal key={name} delay={i * 0.04}>
                  <div className="mkt-proofbar-logo" aria-hidden>
                    <span>{name}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-intro" aria-label="What is TeachTrack">
        <div className="mkt-shell">
          <div className="mkt-intro-wrap">
            <div className="mkt-intro-copy">
              <SectionHeading
                eyebrow="The calm teaching workspace"
                title="What is TeachTrack?"
                description="TeachTrack is where planning, attendance, tasks, and feedback live together — so your day runs smoothly and your evenings stay yours."
              >
                <Reveal delay={0.1}>
                  <div className="mkt-intro-actions">
                    <Button onClick={scrollToFeatures} variant="secondary">
                      How it works
                    </Button>
                    <Button as={Link} to="/pricing" variant="ghost">
                      Pricing
                    </Button>
                  </div>
                </Reveal>
              </SectionHeading>

              <div className="mkt-intro-rich">
                <Reveal>
                  <div className="mkt-intro-audience">
                    <span className="mkt-intro-audienceLabel">Built for</span>
                    <div className="mkt-intro-chips" aria-label="Audience">
                      <span>Teachers</span>
                      <span>Tutors</span>
                      <span>Schools</span>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.05}>
                  <p className="mkt-intro-paragraph">
                    Instead of juggling spreadsheets, chat threads, and scattered docs, TeachTrack keeps the entire class context
                    connected — plans, notes, tasks, and progress — so you can teach in the moment and catch up later without
                    re-typing everything.
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <div className="mkt-intro-replaces" aria-label="Replaces">
                    <div className="mkt-intro-replacesTitle">Replaces</div>
                    <div className="mkt-intro-replacesGrid">
                      <div className="mkt-intro-replaceItem">Spreadsheets for attendance</div>
                      <div className="mkt-intro-replaceItem">Docs for lesson drafts</div>
                      <div className="mkt-intro-replaceItem">Loose links for quizzes</div>
                      <div className="mkt-intro-replaceItem">Manual end‑of‑term reports</div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="mkt-intro-proof" aria-label="Quick proof points">
                    <div className="mkt-intro-metric">
                      <div className="mkt-intro-metricVal">60s</div>
                      <div className="mkt-intro-metricLbl">to create a class</div>
                    </div>
                    <div className="mkt-intro-metric">
                      <div className="mkt-intro-metricVal">30s</div>
                      <div className="mkt-intro-metricLbl">to mark attendance</div>
                    </div>
                    <div className="mkt-intro-metric">
                      <div className="mkt-intro-metricVal">1 click</div>
                      <div className="mkt-intro-metricLbl">to export reports</div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="mkt-intro-points">
                <Reveal>
                  <div className="mkt-intro-point">
                    <div className="mkt-intro-pointIco" aria-hidden><IconClasses /></div>
                    <div>
                      <div className="mkt-intro-pointTitle">One place for the daily routine</div>
                      <div className="mkt-intro-pointBody">Classes, rosters, notes, and tasks stay connected — no tab-hopping.</div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.05}>
                  <div className="mkt-intro-point">
                    <div className="mkt-intro-pointIco is-teal" aria-hidden><IconAttendance /></div>
                    <div>
                      <div className="mkt-intro-pointTitle">Fast, reliable operations</div>
                      <div className="mkt-intro-pointBody">Mark attendance in seconds, keep history clean, and surface patterns early.</div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="mkt-intro-point">
                    <div className="mkt-intro-pointIco is-amber" aria-hidden><IconAI /></div>
                    <div>
                      <div className="mkt-intro-pointTitle">AI that stays in your voice</div>
                      <div className="mkt-intro-pointBody">Drafts lessons and feedback you can edit — no “black box” decisions.</div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal>
              <div className="mkt-intro-visual" aria-hidden>
                <div className="mkt-intro-surface">
                  <div className="mkt-intro-surfaceTop">
                    <span className="mkt-intro-pill">TeachTrack</span>
                    <span className="mkt-intro-pill is-soft">Today</span>
                  </div>
                  <div className="mkt-intro-grid">
                    <div className="mkt-intro-mini">
                      <span>Next class</span>
                      <strong>Mathematics 101</strong>
                      <em>9:00 AM · Room 12</em>
                    </div>
                    <div className="mkt-intro-mini">
                      <span>Attendance</span>
                      <strong>96%</strong>
                      <em>Week view ready</em>
                    </div>
                    <div className="mkt-intro-mini is-wide">
                      <span>AI draft</span>
                      <strong>Lesson plan outline</strong>
                      <div className="mkt-intro-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="mkt-intro-mini is-wide">
                      <span>Reports</span>
                      <strong>Export ready</strong>
                      <div className="mkt-intro-badges">
                        <b>Grades</b>
                        <b>Attendance</b>
                        <b>Notes</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mkt-howVideo" aria-label="See how it works">
        <div className="mkt-shell">
          <div className="mkt-howVideo-wrap">
            <div className="mkt-howVideo-head">
              <SectionHeading
                align="center"
                eyebrow="Quick walkthrough"
                title="See How it Works"
                description="A short product tour that shows the calm workflow — from planning to attendance to reporting."
              />
            </div>

            <Reveal>
              <div className="mkt-howVideo-card" ref={howVideoRef}>
                <div className="mkt-howVideo-top">
                  <div className="mkt-howVideo-meta">
                    <span className="mkt-howVideo-pill">TeachTrack Tour</span>
                    <span className="mkt-howVideo-pill is-soft">2 min</span>
                  </div>
                  <div className="mkt-howVideo-actions" aria-hidden>
                    <span className="mkt-howVideo-dot" />
                    <span className="mkt-howVideo-dot is-mid" />
                    <span className="mkt-howVideo-dot is-low" />
                  </div>
                </div>

                <div className="mkt-howVideo-frame" role="group" aria-label="Video container">
                  <div className="mkt-howVideo-play" aria-hidden>
                    <span />
                  </div>
                  <div className="mkt-howVideo-hint">Drop your product walkthrough video here</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mkt-personas" aria-label="Use cases">
        <div className="mkt-shell">
          <div
            className="mkt-personas-wrap"
            onMouseEnter={() => {
              personaPausedRef.current = true
            }}
            onMouseLeave={() => {
              personaPausedRef.current = false
              personaLastSwitchRef.current = Date.now()
            }}
            onFocusCapture={() => {
              personaPausedRef.current = true
            }}
            onBlurCapture={() => {
              personaPausedRef.current = false
              personaLastSwitchRef.current = Date.now()
            }}
          >
            <div className="mkt-personas-head">
              <SectionHeading
                eyebrow="Use cases"
                title="Designed for the way you teach."
                description="Pick your role. TeachTrack adapts to your workflow — planning, delivery, tracking, and reporting — without the clutter."
              />

              <div className="mkt-personas-tabs" role="tablist" aria-label="Personas">
                <button
                  type="button"
                  role="tab"
                  aria-selected={persona === 'teacher'}
                  className={`mkt-personas-tab ${persona === 'teacher' ? 'is-active' : ''}`}
                  onClick={() => setPersonaFromUser('teacher')}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={persona === 'tutor'}
                  className={`mkt-personas-tab ${persona === 'tutor' ? 'is-active' : ''}`}
                  onClick={() => setPersonaFromUser('tutor')}
                >
                  Tutor
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={persona === 'school'}
                  className={`mkt-personas-tab ${persona === 'school' ? 'is-active' : ''}`}
                  onClick={() => setPersonaFromUser('school')}
                >
                  School
                </button>
              </div>
            </div>

            <motion.div
              key={persona}
              className="mkt-personas-panel"
              initial={{ opacity: 0, y: 14, scale: 0.985, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="tabpanel"
            >
              {persona === 'teacher' && (
                <motion.div
                  className="mkt-personas-grid"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
                  }}
                >
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Before class</span>
                    <h3>Plan faster, in your voice.</h3>
                    <p>Draft lesson objectives and activities, then edit and reuse across weeks.</p>
                    <ul>
                      <li>Lesson drafts + templates</li>
                      <li>Attach resources per class</li>
                      <li>Keep notes with context</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">During class</span>
                    <h3>Attendance in seconds.</h3>
                    <p>Tap through the roster and keep a clean history for follow-ups.</p>
                    <ul>
                      <li>One-tap marking</li>
                      <li>Week history</li>
                      <li>At-risk patterns</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">After class</span>
                    <h3>Track learning without the spreadsheet.</h3>
                    <p>Quizzes, checklists, and feedback that stays tied to the student.</p>
                    <ul>
                      <li>Share links or assign</li>
                      <li>Marking criteria</li>
                      <li>Exportable summaries</li>
                    </ul>
                  </motion.div>
                </motion.div>
              )}

              {persona === 'tutor' && (
                <motion.div
                  className="mkt-personas-grid"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
                  }}
                >
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Clients</span>
                    <h3>Keep every student’s story clear.</h3>
                    <p>Notes, goals, and progress in one place — without messy messaging threads.</p>
                    <ul>
                      <li>Session notes</li>
                      <li>Goals + tasks</li>
                      <li>Quick follow-ups</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Materials</span>
                    <h3>Build mini quizzes in minutes.</h3>
                    <p>Send a link, collect responses, and see what needs reteaching.</p>
                    <ul>
                      <li>MCQ + short answers</li>
                      <li>Response tracking</li>
                      <li>Auto-grading where possible</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Reports</span>
                    <h3>Share progress professionally.</h3>
                    <p>Generate a clean snapshot you can send to parents or students.</p>
                    <ul>
                      <li>Per-student summaries</li>
                      <li>Export to PDF/CSV</li>
                      <li>Term-ready format</li>
                    </ul>
                  </motion.div>
                </motion.div>
              )}

              {persona === 'school' && (
                <motion.div
                  className="mkt-personas-grid"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
                  }}
                >
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Consistency</span>
                    <h3>One system across classrooms.</h3>
                    <p>Standardize core flows while letting teachers keep their style.</p>
                    <ul>
                      <li>Shared structures</li>
                      <li>Simple onboarding</li>
                      <li>Clear accountability</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Visibility</span>
                    <h3>Spot patterns early.</h3>
                    <p>Attendance and progress signals that help you intervene sooner.</p>
                    <ul>
                      <li>Week/month views</li>
                      <li>Exportable reports</li>
                      <li>Audit-friendly history</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    className="mkt-personas-card"
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.99 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="mkt-personas-label">Rollout</span>
                    <h3>Works with real constraints.</h3>
                    <p>No complicated setup — teachtrack runs in the browser and on mobile.</p>
                    <ul>
                      <li>Web + mobile</li>
                      <li>Role-based access</li>
                      <li>Data ownership</li>
                    </ul>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mkt-workflow" id="features" aria-label="Workflow">
        <div className="mkt-shell">
          <div className="mkt-workflow-wrap" ref={workflowRef}>
            <SectionHeading
              align="center"
              eyebrow="Everything in one calm place"
              title="A premium workflow canvas."
              description="Three moments that define the day — plan, teach, and measure — with everything connected and always ready to export."
            >
              <Reveal delay={0.12}>
                <div className="mkt-workflow-cta">
                  <Button as={Link} to="/app" variant="secondary" size="sm">
                    View demo
                  </Button>
                  <Button as={Link} to="/pricing" variant="ghost" size="sm">
                    See pricing
                  </Button>
                </div>
              </Reveal>
            </SectionHeading>

            <div className="mkt-workflow-grid" aria-label="Workflow tiles">
              {WORKFLOW.map((c) => (
                <article key={c.key} className={`mkt-workflow-card is-${c.tone}`} data-workflow-card>
                  <div className={`mkt-workflow-ico is-${c.tone}`} aria-hidden>
                    {c.icon}
                  </div>
                  <div className="mkt-workflow-kicker">{c.kicker}</div>
                  <h3 className="mkt-workflow-title">{c.title}</h3>
                  <p className="mkt-workflow-body">{c.body}</p>
                  <ul className="mkt-workflow-bullets">
                    {c.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="mkt-workflow-mini" aria-hidden>
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              ))}

              <article className="mkt-workflow-wide" data-workflow-card aria-label="Connected surfaces">
                <div className="mkt-workflow-wideHead">
                  <div className="mkt-workflow-wideTitle">Connected surfaces</div>
                  <div className="mkt-workflow-widePills" aria-hidden>
                    <span>Web</span>
                    <span>Mobile</span>
                    <span>Exports</span>
                  </div>
                </div>
                <div className="mkt-workflow-wideGrid" aria-hidden>
                  <div className="mkt-workflow-wideTile">
                    <b>Today</b>
                    <em>3 classes · 2 tasks</em>
                    <i style={{ width: '78%' }} />
                  </div>
                  <div className="mkt-workflow-wideTile">
                    <b>Attendance</b>
                    <em>Week view ready</em>
                    <i style={{ width: '92%' }} />
                  </div>
                  <div className="mkt-workflow-wideTile">
                    <b>Report export</b>
                    <em>Share-ready</em>
                    <i style={{ width: '100%' }} />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-mobile" aria-label="Mobile app">
        <div className="mkt-shell">
          <div className="mkt-mobile-stage">
            <div className="mkt-mobile-wrap">
              <div className="mkt-mobile-copy">
                <SectionHeading
                  eyebrow="iOS + Android"
                  title="TeachTrack on your phone."
                  description="Mark attendance, capture notes, and check what’s next — right from the hallway. Your classes stay synced across web and mobile."
                >
                  <Reveal delay={0.1}>
                    <div className="mkt-mobile-actions">
                      <a className="mkt-storeBtn" href="#" aria-label="Open on the App Store">
                        <span className="mkt-storeIco" aria-hidden><IconApple /></span>
                        <span className="mkt-storeText">
                          <span>Download on the</span>
                          <strong>App Store</strong>
                        </span>
                      </a>
                      <a className="mkt-storeBtn is-play" href="#" aria-label="Get it on Google Play">
                        <span className="mkt-storeIco" aria-hidden><IconGooglePlay /></span>
                        <span className="mkt-storeText">
                          <span>Get it on</span>
                          <strong>Google Play</strong>
                        </span>
                      </a>
                    </div>
                  </Reveal>
                </SectionHeading>

                <div className="mkt-mobile-bullets" aria-label="Mobile highlights">
                  <Reveal>
                    <div className="mkt-mobile-bullet">
                      <div className="mkt-mobile-dot" aria-hidden />
                      <div>
                        <div className="mkt-mobile-bulletTitle">Fast roll call</div>
                        <div className="mkt-mobile-bulletBody">Tap present/late/absent — saved instantly with week history.</div>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.05}>
                    <div className="mkt-mobile-bullet">
                      <div className="mkt-mobile-dot" aria-hidden />
                      <div>
                        <div className="mkt-mobile-bulletTitle">Notes in the moment</div>
                        <div className="mkt-mobile-bulletBody">Capture quick student notes and follow-ups without breaking flow.</div>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div className="mkt-mobile-bullet">
                      <div className="mkt-mobile-dot" aria-hidden />
                      <div>
                        <div className="mkt-mobile-bulletTitle">Always in sync</div>
                        <div className="mkt-mobile-bulletBody">Everything updates across devices — no duplicate work, no surprises.</div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>

              <Reveal>
                <div className="mkt-mobile-visual" aria-hidden>
                  <div className="mkt-phone">
                    <div className="mkt-phone-notch" />
                    <div className="mkt-phone-screen">
                      <div className="mkt-phone-top">
                        <span className="mkt-phone-pill">Attendance</span>
                        <span className="mkt-phone-pill is-soft">Mon</span>
                      </div>
                      <div className="mkt-phone-card">
                        <div className="mkt-phone-cardHead">
                          <strong>Mathematics 101</strong>
                          <span>Period 1</span>
                        </div>
                        <div className="mkt-phone-roster">
                          <div className="mkt-phone-row"><i /><b>Amir</b><em>Present</em></div>
                          <div className="mkt-phone-row"><i /><b>Sara</b><em>Late</em></div>
                          <div className="mkt-phone-row"><i /><b>Noah</b><em>Absent</em></div>
                          <div className="mkt-phone-row"><i /><b>Lina</b><em>Present</em></div>
                        </div>
                      </div>
                      <div className="mkt-phone-mini">
                        <span>Week view</span>
                        <div className="mkt-phone-spark">
                          <i style={{ height: '40%' }} />
                          <i style={{ height: '72%' }} />
                          <i style={{ height: '55%' }} />
                          <i style={{ height: '92%' }} />
                          <i style={{ height: '78%' }} />
                          <i style={{ height: '88%' }} />
                          <i style={{ height: '96%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mkt-mobile-glow" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-security" aria-label="Security and privacy">
        <div className="mkt-shell">
          <div className="mkt-security-wrap">
            <SectionHeading
              align="center"
              eyebrow="Security & privacy"
              title="Trust is a feature."
              description="TeachTrack is built with practical safeguards — so you can focus on teaching, not worrying about data."
            />

            <div className="mkt-security-grid" aria-label="Security highlights">
              <Reveal>
                <div className="mkt-security-card">
                  <div className="mkt-security-ico" aria-hidden><IconShield /></div>
                  <div className="mkt-security-title">Data ownership</div>
                  <div className="mkt-security-body">Your data stays yours. Export what you need, when you need it.</div>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="mkt-security-card">
                  <div className="mkt-security-ico is-teal" aria-hidden><IconLock /></div>
                  <div className="mkt-security-title">Encryption</div>
                  <div className="mkt-security-body">Encrypted in transit, with secure session handling and access boundaries.</div>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mkt-security-card">
                  <div className="mkt-security-ico is-amber" aria-hidden><IconCloud /></div>
                  <div className="mkt-security-title">Backups</div>
                  <div className="mkt-security-body">Reliable storage and recoverability so classroom history doesn’t vanish.</div>
                </div>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mkt-security-card">
                  <div className="mkt-security-ico is-indigo" aria-hidden><IconUsers /></div>
                  <div className="mkt-security-title">Role-based access</div>
                  <div className="mkt-security-body">Designed for teacher, tutor, and school contexts with clear permissions.</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-preview">
        <div className="mkt-shell">
          <div className="mkt-preview-canvas">
            <div className="mkt-preview-head">
              <Reveal>
                <span className="mkt-eyebrow">
                  <span className="mkt-eyebrow-dot" aria-hidden />
                  Inside the product
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mkt-h2">A glimpse at the day-to-day surfaces</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mkt-lede">
                  Three of the moments TeachTrack quietly speeds up: taking
                  attendance, building a quiz, and getting an AI-drafted lesson
                  plan you can edit in your own voice.
                </p>
              </Reveal>
            </div>

            <div className="mkt-preview-cards">
              <Reveal>
                <article className="mkt-preview-card">
                  <span className="mkt-preview-card-eyebrow">Attendance</span>
                  <h3 className="mkt-preview-card-title">Roll in 30 seconds</h3>
                  <p className="mkt-preview-card-desc">
                    Tap through the roster. The week-view chart updates live so
                    you can spot patterns before they become problems.
                  </p>
                  <div className="mkt-preview-art mkt-preview-art-attendance" aria-hidden>
                    <span style={{ height: '40%' }} />
                    <span style={{ height: '70%' }} />
                    <span style={{ height: '55%' }} />
                    <span style={{ height: '92%' }} />
                    <span style={{ height: '78%' }} />
                    <span style={{ height: '88%' }} />
                    <span style={{ height: '95%' }} />
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.1}>
                <article className="mkt-preview-card">
                  <span className="mkt-preview-card-eyebrow">Quizzes</span>
                  <h3 className="mkt-preview-card-title">Build &amp; publish</h3>
                  <p className="mkt-preview-card-desc">
                    Drag questions, set marking criteria, and ship a share link
                    students open without an account.
                  </p>
                  <div className="mkt-preview-art mkt-preview-art-quiz" aria-hidden>
                    <div className="mkt-preview-art-quiz-row">
                      <span className="mkt-preview-art-quiz-dot is-on" />
                      <span />
                      <em>MCQ</em>
                    </div>
                    <div className="mkt-preview-art-quiz-row">
                      <span className="mkt-preview-art-quiz-dot" />
                      <span />
                      <em>Short</em>
                    </div>
                    <div className="mkt-preview-art-quiz-row">
                      <span className="mkt-preview-art-quiz-dot is-on" />
                      <span />
                      <em>Check</em>
                    </div>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.2}>
                <article className="mkt-preview-card">
                  <span className="mkt-preview-card-eyebrow">AI Lesson</span>
                  <h3 className="mkt-preview-card-title">Drafted, not dictated</h3>
                  <p className="mkt-preview-card-desc">
                    Type a topic and grade. TeachTrack drafts objectives,
                    activities, and a closing — all editable in your own voice.
                  </p>
                  <div className="mkt-preview-art mkt-preview-art-ai" aria-hidden>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-testimonials">
        <div className="mkt-shell">
          <SectionHeading
            align="center"
            eyebrow="Loved by teachers · trusted by schools"
            title="Quietly giving teachers their evenings back"
            description="A few notes from teachers running TeachTrack across maths, English, and science classrooms."
          />
        </div>

        <div className="mkt-twall" aria-label="Testimonial wall">
          <div className="mkt-twall-stage">
            <div className="mkt-twall-fade is-top" aria-hidden />
            <div className="mkt-twall-fade is-bot" aria-hidden />

            {(() => {
              const COLS = 5
              const WALL = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
              const cols = Array.from({ length: COLS }, (_, c) => WALL.filter((_, i) => i % COLS === c))
              return (
                <div className="mkt-twall-cols">
                  {cols.map((items, colIdx) => {
                    const dur = 18 + (colIdx % 3) * 3
                    const dir = colIdx % 2 === 0 ? 'up' : 'down'
                    const doubled = [...items, ...items]
                    return (
                      <div className="mkt-twall-col" key={colIdx}>
                        <div
                          className={`mkt-twall-track is-${dir}`}
                          style={{ '--dur': `${dur}s` }}
                        >
                          {doubled.map((t, i) => (
                            <div className="mkt-twall-item" key={`${t.name}-${colIdx}-${i}`}>
                              <TestimonialCard {...t} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          <div className="mkt-shell">
            <div className="mkt-testimonials-grid is-fallback" aria-hidden>
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <TestimonialCard {...t} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-cta">
        <Reveal>
          <div className="mkt-cta-card">
            <div className="mkt-cta-content">
              <span className="mkt-eyebrow" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
                <span className="mkt-eyebrow-dot" aria-hidden />
                Free for individual teachers
              </span>
              <h2 className="mkt-h2">Get back six hours a week. Starting today.</h2>
              <p>
                It takes 60 seconds to create your first class. No credit card,
                no install, no school IT meeting required.
              </p>
              <div className="mkt-cta-actions">
                <Button as={Link} to="/signup" variant="secondary">
                  Start free
                </Button>
                <Button as={Link} to="/contact" variant="ghost" style={{ color: '#fff' }}>
                  Talk to us
                </Button>
              </div>
              <span className="mkt-cta-meta">
                Built for K–12, college, and private tutors. Your data stays yours.
              </span>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
