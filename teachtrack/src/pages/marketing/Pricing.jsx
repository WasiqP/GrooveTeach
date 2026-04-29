import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../../components/marketing/SectionHeading'
import PricingCard from '../../components/marketing/PricingCard'
import Reveal from '../../components/marketing/Reveal'
import AnimatedText from '../../components/marketing/AnimatedText'
import './Pricing.css'

const PLANS = {
  monthly: [
    {
      name: 'Free',
      description: 'For individual teachers running their own classroom.',
      price: '0',
      period: 'forever',
      features: [
        'Up to 3 classes',
        'Attendance + class roster',
        'Basic quiz / task builder',
        'Class announcements & activity feed',
        'Local data — yours to keep',
      ],
      cta: { label: 'Get started free', to: '/signup' },
    },
    {
      name: 'Pro',
      description: 'For teachers who want AI assistance and unlimited usage.',
      price: '8',
      cents: '.00',
      period: '/teacher / month',
      features: [
        'Unlimited classes & students',
        'AI lesson planning (drafts you edit)',
        'AI-assisted grading & rubrics',
        'Homework, schedule, and reports',
        'Email + chat support',
      ],
      cta: { label: 'Start 14-day Pro trial', to: '/signup' },
      featured: true,
      badge: 'Most loved',
    },
    {
      name: 'School',
      description: 'For schools, districts, and tutoring networks.',
      price: 'Custom',
      features: [
        'Everything in Pro, for every teacher',
        'SSO + role-based admin',
        'School-wide reporting & analytics',
        'Onboarding & teacher training',
        'Priority support + SLAs',
      ],
      cta: { label: 'Talk to sales', to: '/contact' },
    },
  ],
  yearly: [
    {
      name: 'Free',
      description: 'For individual teachers running their own classroom.',
      price: '0',
      period: 'forever',
      features: [
        'Up to 3 classes',
        'Attendance + class roster',
        'Basic quiz / task builder',
        'Class announcements & activity feed',
        'Local data — yours to keep',
      ],
      cta: { label: 'Get started free', to: '/signup' },
    },
    {
      name: 'Pro',
      description: 'For teachers who want AI assistance and unlimited usage.',
      price: '6',
      cents: '.40',
      period: '/teacher / month, billed yearly',
      features: [
        'Unlimited classes & students',
        'AI lesson planning (drafts you edit)',
        'AI-assisted grading & rubrics',
        'Homework, schedule, and reports',
        'Email + chat support',
      ],
      cta: { label: 'Start 14-day Pro trial', to: '/signup' },
      featured: true,
      badge: 'Save 20%',
    },
    {
      name: 'School',
      description: 'For schools, districts, and tutoring networks.',
      price: 'Custom',
      features: [
        'Everything in Pro, for every teacher',
        'SSO + role-based admin',
        'School-wide reporting & analytics',
        'Onboarding & teacher training',
        'Priority support + SLAs',
      ],
      cta: { label: 'Talk to sales', to: '/contact' },
    },
  ],
}

const COMPARE_ROWS = [
  ['Classes', '3 classes', 'Unlimited', 'Unlimited (org)'],
  ['Students per class', 'Up to 30', 'Unlimited', 'Unlimited'],
  ['Attendance + history', 'Yes', 'Yes', 'Yes'],
  ['Quizzes & assignments', 'Basic', 'Advanced + share links', 'Advanced + LMS export'],
  ['Homework tracking', '—', 'Yes', 'Yes'],
  ['AI lesson plans', '—', 'Yes', 'Yes (governed)'],
  ['AI-assisted grading', '—', 'Yes', 'Yes (governed)'],
  ['Reports & analytics', '—', 'Per teacher', 'Per teacher + school-wide'],
  ['SSO + admin roles', '—', '—', 'Yes'],
  ['Priority support / SLA', '—', 'Email + chat', 'Priority + SLA'],
]

const FAQ = [
  {
    q: 'Is the Free plan really free?',
    a: 'Yes — forever, for individual teachers, up to 3 classes. We don’t harvest student data and we don’t resell anything. Free is funded by Pro and School plans.',
  },
  {
    q: 'How does the AI work — and is it safe for student data?',
    a: 'AI is opt-in and runs on lesson plans, rubric drafts, and parent-friendly comments. Student PII is never sent to the model. You can turn AI off entirely from Settings.',
  },
  {
    q: 'Can my school pilot TeachTrack?',
    a: 'Absolutely. We run free 4-week pilots for schools with 10+ teachers. Reach out via the contact form and we’ll set up onboarding.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'You can export everything (classes, students, attendance, grades) as JSON or CSV. After 30 days, we permanently delete account data unless you export it sooner.',
  },
  {
    q: 'Do you support districts / multi-school accounts?',
    a: 'School plans cover up to a single school. Districts get a separate quote with cross-school analytics and shared admin roles. Contact us for a tailored proposal.',
  },
]

export default function MarketingPricing() {
  const [billing, setBilling] = useState('monthly')
  const containerRef = useRef(null)
  const monthlyBtnRef = useRef(null)
  const yearlyBtnRef = useRef(null)
  const [pillRect, setPillRect] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const target = billing === 'monthly' ? monthlyBtnRef.current : yearlyBtnRef.current
    if (!target || !containerRef.current) return
    const containerLeft = containerRef.current.getBoundingClientRect().left
    const targetRect = target.getBoundingClientRect()
    setPillRect({
      left: targetRect.left - containerLeft,
      width: targetRect.width,
    })
  }, [billing])

  const plans = PLANS[billing]

  return (
    <>
      <section className="mkt-pricing-hero">
        <div className="mkt-aurora" aria-hidden />
        <div className="mkt-grid-bg" aria-hidden />
        <div className="mkt-pricing-hero-shell">
          <Reveal>
            <span className="mkt-eyebrow">
              <span className="mkt-eyebrow-dot" aria-hidden />
              Pricing · transparent &amp; teacher-first
            </span>
          </Reveal>
          <AnimatedText
            as="h1"
            text="Free for teachers. Fair for schools."
            highlight={['teachers.', 'schools.']}
            stagger={0.06}
          />
          <Reveal delay={0.2}>
            <p className="mkt-lede">
              Use TeachTrack free for your own classroom — forever. Upgrade to
              Pro when you want AI assistance, or roll us out school-wide with
              shared analytics and admin controls.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mkt-billing-toggle" ref={containerRef} role="tablist" aria-label="Billing period">
              <motion.span
                className="mkt-billing-toggle-pill"
                aria-hidden
                initial={false}
                animate={{ left: pillRect.left, width: pillRect.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
              <button
                ref={monthlyBtnRef}
                type="button"
                role="tab"
                aria-selected={billing === 'monthly'}
                className={billing === 'monthly' ? 'is-active' : ''}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                ref={yearlyBtnRef}
                type="button"
                role="tab"
                aria-selected={billing === 'yearly'}
                className={billing === 'yearly' ? 'is-active' : ''}
                onClick={() => setBilling('yearly')}
              >
                Yearly
                <span className="mkt-billing-savings">−20%</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mkt-pricing-grid-section">
        <motion.div
          className="mkt-pricing-grid"
          key={billing}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.06}>
              <PricingCard {...plan} />
            </Reveal>
          ))}
        </motion.div>
      </section>

      <section className="mkt-compare">
        <div className="mkt-shell">
          <SectionHeading
            align="center"
            eyebrow="Plan comparison"
            title="Pick the plan that fits how you teach"
            description="Every plan includes the same calm UX. Pro and School unlock AI, scale, and admin controls."
          />

          <Reveal>
            <div className="mkt-compare-card">
              <div className="mkt-compare-row is-head">
                <div className="mkt-compare-cell is-head">Feature</div>
                <div className="mkt-compare-cell is-head">Free</div>
                <div className="mkt-compare-cell is-head">Pro</div>
                <div className="mkt-compare-cell is-head">School</div>
              </div>

              {COMPARE_ROWS.map(([feature, free, pro, school]) => (
                <div className="mkt-compare-row" key={feature}>
                  <div className="mkt-compare-cell is-feature">{feature}</div>
                  <div className="mkt-compare-cell" data-label="Free">
                    {free === 'Yes' ? (
                      <span className="mkt-compare-tick" aria-hidden>
                        ✓
                      </span>
                    ) : free === '—' ? (
                      <span className="mkt-compare-no">—</span>
                    ) : (
                      free
                    )}
                  </div>
                  <div className="mkt-compare-cell" data-label="Pro">
                    {pro === 'Yes' ? (
                      <span className="mkt-compare-tick" aria-hidden>
                        ✓
                      </span>
                    ) : pro === '—' ? (
                      <span className="mkt-compare-no">—</span>
                    ) : (
                      pro
                    )}
                  </div>
                  <div className="mkt-compare-cell" data-label="School">
                    {school === 'Yes' ? (
                      <span className="mkt-compare-tick" aria-hidden>
                        ✓
                      </span>
                    ) : school === '—' ? (
                      <span className="mkt-compare-no">—</span>
                    ) : (
                      school
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mkt-faq">
        <div className="mkt-shell">
          <SectionHeading
            align="center"
            eyebrow="Frequently asked"
            title="Five real questions, five honest answers"
          />

          <div className="mkt-faq-list">
            {FAQ.map((row, i) => (
              <Reveal key={row.q} delay={i * 0.05}>
                <details className="mkt-faq-item">
                  <summary>{row.q}</summary>
                  <p>{row.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
