import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import AuthHero from './AuthHero'
import './Auth.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    navigate('/verify-otp', { state: { email: email.trim(), purpose: 'reset' } })
  }

  return (
    <div className="tt-authShell">
      <div className="tt-authCard">
        <section className="tt-authPanel">
          <div className="tt-authBackRow">
            <Link to="/login" className="tt-authBackLink">
              <BackChevron />
              <span>Back to Login</span>
            </Link>
            <div className="tt-authBrandInline">
              <Logo size={28} />
              <span>
                Teach<span className="tt-authBrandAccent">Track</span>
              </span>
            </div>
          </div>

          <header className="tt-authPanelHeader">
            <div className="tt-authEyebrow">Reset password</div>
            <h1 className="tt-authHeading">Forgot password?</h1>
            <p className="tt-authGreeting">Tell us your email and we'll send you a 6-digit code to reset your password.</p>
          </header>

          <form className="tt-authForm" onSubmit={onSubmit} noValidate>
            <div className="tt-authField">
              <label htmlFor="email">Email</label>
              <div className="tt-authInput">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="tt-authCta">
              Send code
            </button>
          </form>

          <div className="tt-authSwitch">
            <span>Remembered it?</span>
            <Link to="/login">Back to Login</Link>
          </div>
        </section>

        <AuthHero
          badges={['Reset in 30s', 'No spam']}
          chat={[
            { from: 'bot', text: "No worries — happens to the best teachers. We'll send you a fresh 6-digit code." },
            { from: 'user', text: 'Thanks TeeTee.' },
          ]}
        />
      </div>
    </div>
  )
}

function BackChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
    </svg>
  )
}
