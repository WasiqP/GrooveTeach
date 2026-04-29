import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Reveal from '../../components/marketing/Reveal'
import AnimatedText from '../../components/marketing/AnimatedText'
import './Contact.css'

const TYPES = [
  { id: 'general', label: 'General' },
  { id: 'sales', label: 'Schools / Sales' },
  { id: 'support', label: 'Support' },
  { id: 'press', label: 'Press' },
]

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-6.16 7-11a7 7 0 1 0-14 0c0 4.84 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 13 4 4 10-10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18.244 2H21l-6.51 7.44L22 22h-6.83l-4.76-6.22L4.78 22H2l6.96-7.95L2 2h7l4.3 5.7L18.244 2Zm-1.2 18h1.71L7.05 4H5.23l11.81 16Z" fill="currentColor" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75ZM10 9.75h3.83v1.55h.05c.53-1 1.83-2.05 3.77-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.94c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z" fill="currentColor" />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.6 2 12.27c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.79.62-3.38-1.37-3.38-1.37-.46-1.18-1.12-1.5-1.12-1.5-.91-.64.07-.62.07-.62 1.01.07 1.55 1.06 1.55 1.06.9 1.58 2.36 1.13 2.94.86.09-.67.35-1.13.64-1.39-2.23-.26-4.57-1.14-4.57-5.07 0-1.12.39-2.04 1.04-2.76-.1-.26-.45-1.31.1-2.74 0 0 .85-.28 2.79 1.05A9.5 9.5 0 0 1 12 7.07c.86 0 1.73.12 2.54.35 1.94-1.33 2.79-1.05 2.79-1.05.55 1.43.2 2.48.1 2.74.65.72 1.04 1.64 1.04 2.76 0 3.94-2.34 4.81-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49C19.13 20.64 22 16.8 22 12.27 22 6.6 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function MarketingContact() {
  const [type, setType] = useState('general')
  const [form, setForm] = useState({ name: '', email: '', school: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return

    setSubmitting(true)
    await new Promise((res) => setTimeout(res, 800))
    setSubmitting(false)
    setDone(true)
  }

  return (
    <section className="mkt-contact">
      <div className="mkt-aurora" aria-hidden />
      <div className="mkt-grid-bg" aria-hidden />

      <div className="mkt-contact-shell">
        <div className="mkt-contact-grid">
          <div className="mkt-contact-copy">
            <Reveal>
              <span className="mkt-eyebrow">
                <span className="mkt-eyebrow-dot" aria-hidden />
                Let’s talk
              </span>
            </Reveal>
            <AnimatedText
              as="h1"
              text="We read every message ourselves."
              highlight={['ourselves.']}
              stagger={0.06}
            />
            <Reveal delay={0.2}>
              <p>
                Teacher, principal, parent, journalist, builder — pick whatever
                channel feels right. We aim to respond within one business day,
                usually faster, and never with a bot.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mkt-contact-channels">
                <a className="mkt-contact-channel" href="mailto:hello@teachtrack.app">
                  <span className="mkt-contact-channel-icon">
                    <IconMail />
                  </span>
                  <span>
                    <span className="mkt-contact-channel-label">Email</span>
                    <br />
                    <span className="mkt-contact-channel-value">hello@teachtrack.app</span>
                  </span>
                </a>

                <a className="mkt-contact-channel" href="mailto:support@teachtrack.app">
                  <span className="mkt-contact-channel-icon">
                    <IconChat />
                  </span>
                  <span>
                    <span className="mkt-contact-channel-label">Support</span>
                    <br />
                    <span className="mkt-contact-channel-value">support@teachtrack.app</span>
                  </span>
                </a>

                <div className="mkt-contact-channel">
                  <span className="mkt-contact-channel-icon">
                    <IconPin />
                  </span>
                  <span>
                    <span className="mkt-contact-channel-label">Office</span>
                    <br />
                    <span className="mkt-contact-channel-value">
                      Remote · AEST &amp; PST teachers
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mkt-contact-socials" aria-label="Social links">
                <a href="#" aria-label="Twitter / X"><IconTwitter /></a>
                <a href="#" aria-label="LinkedIn"><IconLinkedIn /></a>
                <a href="#" aria-label="GitHub"><IconGitHub /></a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form className="mkt-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="mkt-contact-form-head">
                <h2>Send us a message</h2>
                <p>We don’t track this form. It just goes to a real human inbox.</p>
              </div>

              <div className="mkt-contact-fields">
                <div className="mkt-contact-field">
                  <label className="mkt-contact-label">What is this about?</label>
                  <div className="mkt-contact-row-types" role="radiogroup" aria-label="Inquiry type">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={type === t.id}
                        className={`mkt-contact-type ${type === t.id ? 'is-active' : ''}`}
                        onClick={() => setType(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mkt-contact-field-row">
                  <div className="mkt-contact-field">
                    <label className="mkt-contact-label" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      className="mkt-contact-input"
                      type="text"
                      placeholder="Maya K."
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={update('name')}
                    />
                  </div>
                  <div className="mkt-contact-field">
                    <label className="mkt-contact-label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      className="mkt-contact-input"
                      type="email"
                      placeholder="you@school.edu"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                    />
                  </div>
                </div>

                <div className="mkt-contact-field">
                  <label className="mkt-contact-label" htmlFor="contact-school">
                    School (optional)
                  </label>
                  <input
                    id="contact-school"
                    className="mkt-contact-input"
                    type="text"
                    placeholder="Westside Academy"
                    value={form.school}
                    onChange={update('school')}
                  />
                </div>

                <div className="mkt-contact-field">
                  <label className="mkt-contact-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    className="mkt-contact-textarea"
                    placeholder="Tell us what you’re trying to do…"
                    required
                    value={form.message}
                    onChange={update('message')}
                  />
                </div>
              </div>

              <div className="mkt-contact-actions">
                <span className="mkt-contact-meta">
                  By submitting, you agree to our friendly privacy practices.
                  No newsletters unless you ask.
                </span>
                <Button
                  as="button"
                  type="submit"
                  className="mkt-btn-glow"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </Button>
              </div>

              <AnimatePresence>
                {done ? (
                  <motion.div
                    className="mkt-contact-success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    role="status"
                    aria-live="polite"
                  >
                    <div className="mkt-contact-success-card">
                      <span className="mkt-contact-success-mark" aria-hidden>
                        <IconCheck />
                      </span>
                      <h3>Got it — message received.</h3>
                      <p>
                        Thanks {form.name.split(' ')[0] || 'friend'}. A real
                        human on the team will reply within one business day.
                      </p>
                      <Button
                        as="button"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setDone(false)
                          setForm({ name: '', email: '', school: '', message: '' })
                        }}
                      >
                        Send another
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
