import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import SectionHeading from '../../components/marketing/SectionHeading'
import Reveal from '../../components/marketing/Reveal'
import AnimatedText from '../../components/marketing/AnimatedText'
import './About.css'

const TIMELINE = [
  {
    id: 't1',
    label: '2025',
    time: 'Origin',
    title: 'A Sunday-night spreadsheet',
    desc: 'Our founder watched a teacher friend re-type the same lesson plan into a spreadsheet at 11 PM. We sketched a calmer assistant on a napkin the next morning.',
  },
  {
    id: 't2',
    label: '2025',
    time: 'Phase 1',
    title: 'Mobile-first prototype',
    desc: 'PulseBox shipped on iOS and Android with classes, attendance, and a quiz builder — all running on local storage so teachers could test it offline.',
  },
  {
    id: 't3',
    label: '2026',
    time: 'Now',
    title: 'TeachTrack on the web',
    desc: 'Same calm UI, same teacher-first patterns — now in the browser, with shareable quiz links, homework, and a seedling of AI assistance.',
  },
  {
    id: 't4',
    label: 'Soon',
    time: 'Next',
    title: 'AI that drafts, never decides',
    desc: 'Lesson plans, rubric-based grading, and parent-friendly comments. Always editable, always your voice — never a black box.',
  },
]

const VALUES = [
  {
    n: '01',
    title: 'Calm by default',
    desc: 'No notification spam, no growth-hack popups, no AI that demands attention. We win when you forget we are running.',
  },
  {
    n: '02',
    title: 'Drafted, not dictated',
    desc: 'AI is a first draft, not a verdict. Every output is editable, attributable, and easy to throw away.',
  },
  {
    n: '03',
    title: 'Teachers own the data',
    desc: 'Your students’ data belongs to your school. Export anytime, delete anytime, no quiet resale to ad networks.',
  },
  {
    n: '04',
    title: 'Boring infrastructure, gentle UI',
    desc: 'Picky about uptime and security. Picky about typography and whitespace. Both matter at 8:54 AM on Monday.',
  },
  {
    n: '05',
    title: 'Built with teachers',
    desc: 'Every release is shaped by a small council of teachers — maths, English, science, kindergarten. They tell us what is fluff.',
  },
  {
    n: '06',
    title: 'Honest about AI',
    desc: 'We say what is real, what is in beta, and what is roadmap. No demoware shipped as production.',
  },
]

export default function MarketingAbout() {
  return (
    <>
      <section className="mkt-about-hero">
        <div className="mkt-aurora" aria-hidden />
        <div className="mkt-grid-bg" aria-hidden />
        <div className="mkt-about-hero-shell">
          <Reveal>
            <span className="mkt-eyebrow">
              <span className="mkt-eyebrow-dot" aria-hidden />
              About TeachTrack
            </span>
          </Reveal>
          <AnimatedText
            as="h1"
            text="Less admin. More teaching."
            highlight={['teaching.']}
            stagger={0.07}
          />
          <Reveal delay={0.2}>
            <p className="mkt-lede">
              We are building a quiet, AI-assisted personal assistant for the
              people who already do the most patient, undervalued work in the
              world — teachers. Our promise is simple: take the admin off
              their plate, and put the time back on it.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mkt-hero-cta-row">
              <Button as={Link} to="/signup" className="mkt-btn-glow">
                Start free
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
                Talk to the team
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mkt-about-stats">
        <div className="mkt-about-stats-grid">
          <Reveal>
            <div className="mkt-about-stat">
              <span className="mkt-about-stat-num">
                <em>6</em> hrs
              </span>
              <span className="mkt-about-stat-label">
                Saved per teacher per week, on average
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mkt-about-stat">
              <span className="mkt-about-stat-num">
                <em>1.2k</em>+
              </span>
              <span className="mkt-about-stat-label">
                Teachers onboarded across pilots
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mkt-about-stat">
              <span className="mkt-about-stat-num">
                <em>40+</em>
              </span>
              <span className="mkt-about-stat-label">
                Schools running classes on TeachTrack
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mkt-about-stat">
              <span className="mkt-about-stat-num">
                <em>97%</em>
              </span>
              <span className="mkt-about-stat-label">
                Teachers say they would recommend it
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mkt-about-row">
        <div className="mkt-shell">
          <div className="mkt-about-copy">
            <Reveal>
              <span className="mkt-eyebrow">
                <span className="mkt-eyebrow-dot" aria-hidden />
                The problem
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2>Teachers are the second-most stressed profession on Earth.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Not because the kids are too much. Because the admin is. Lesson
                plans, attendance, marking, reports, parent emails, school
                portals, IEP paperwork — most of it lives in 11 different
                tabs, none of which were designed for a person who is also
                actively running a classroom.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mkt-about-points">
                <li>3+ hours/week typing the same lesson plans</li>
                <li>1.5 hours/week chasing attendance and follow-ups</li>
                <li>2 hours/week on report comments &amp; parent messages</li>
                <li>Sundays lost to admin instead of rest</li>
              </ul>
            </Reveal>
          </div>

          <div className="mkt-about-art-wrap">
            <Reveal delay={0.1}>
              <div className="mkt-about-art">
                <div className="mkt-about-art-row">
                  <span>Lesson plan · re-typed weekly</span>
                  <span className="mkt-about-art-pill is-rose">3 hrs</span>
                </div>
                <div className="mkt-about-art-rowstack">
                  <div className="mkt-about-art-row">
                    <span>Roll call &amp; follow-ups</span>
                    <span className="mkt-about-art-pill is-amber">1.5 hrs</span>
                  </div>
                  <div className="mkt-about-art-row">
                    <span>Reports &amp; parent emails</span>
                    <span className="mkt-about-art-pill">2 hrs</span>
                  </div>
                  <div className="mkt-about-art-row">
                    <span>Switching between 11 tabs</span>
                    <span className="mkt-about-art-pill is-rose">∞</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mkt-about-row is-flip">
        <div className="mkt-shell">
          <div className="mkt-about-copy">
            <Reveal>
              <span className="mkt-eyebrow">
                <span className="mkt-eyebrow-dot" aria-hidden />
                The vision
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2>An assistant that quietly handles the admin layer.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Imagine starting a Monday already knowing attendance is taken,
                Tuesday’s quiz is published, Wednesday’s lesson is drafted, and
                Friday’s parent updates are queued. Not magic — just an
                assistant that knows your patterns and respects your time.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mkt-about-points">
                <li>One calm dashboard, every workflow in reach</li>
                <li>AI drafts you can edit in your own voice</li>
                <li>Honest data, honest exports, honest deletion</li>
                <li>Free for individual teachers — forever</li>
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mkt-hero-cta-row">
                <Button as={Link} to="/signup" className="mkt-btn-glow">
                  Try it free
                </Button>
                <Button as={Link} to="/pricing" variant="secondary">
                  See pricing
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="mkt-about-art-wrap">
            <Reveal delay={0.1}>
              <div className="mkt-about-art mkt-about-art-dark">
                <div className="mkt-about-art-row">
                  <span>Mon · Attendance auto-prepped</span>
                  <span className="mkt-about-art-pill">Ready</span>
                </div>
                <div className="mkt-about-art-rowstack">
                  <div className="mkt-about-art-row">
                    <span>Tue · Quiz drafted by AI</span>
                    <span className="mkt-about-art-pill">Draft</span>
                  </div>
                  <div className="mkt-about-art-row">
                    <span>Wed · Lesson plan ready</span>
                    <span className="mkt-about-art-pill">Editable</span>
                  </div>
                  <div className="mkt-about-art-row">
                    <span>Fri · Parent updates queued</span>
                    <span className="mkt-about-art-pill">Queued</span>
                  </div>
                </div>
                <div className="mkt-about-art-bar">
                  <span>
                    <em>Time saved</em>
                    <i style={{ width: '78%' }} />
                    <em>6.2 hrs</em>
                  </span>
                  <span>
                    <em>Stress score</em>
                    <i style={{ width: '34%' }} />
                    <em>−42%</em>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mkt-timeline">
        <div className="mkt-shell">
          <SectionHeading
            align="center"
            eyebrow="Our story so far"
            title="From a Sunday-night napkin to TeachTrack"
            description="We are still small, still teacher-led, and still stubborn about shipping calm software. Here is the path to here."
          />

          <div className="mkt-timeline-list">
            {TIMELINE.map((row, i) => (
              <Reveal key={row.id} delay={i * 0.06}>
                <div className="mkt-timeline-row">
                  <span className="mkt-timeline-marker">{i + 1}</span>
                  <div>
                    <span className="mkt-timeline-time">{row.label} · {row.time}</span>
                    <h3 className="mkt-timeline-title">{row.title}</h3>
                    <p className="mkt-timeline-desc">{row.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-values">
        <div className="mkt-shell">
          <SectionHeading
            eyebrow="What we believe"
            title="Six principles we will not compromise on"
            description="When we disagree internally, these are how we break the tie."
          />
          <div className="mkt-values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} delay={i * 0.05}>
                <div className="mkt-value">
                  <span className="mkt-value-num">{v.n}</span>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
