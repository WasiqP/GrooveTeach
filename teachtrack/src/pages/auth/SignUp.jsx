import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import AuthHero from './AuthHero'
import './Auth.css'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !agree) return
    if (password !== confirm) return
    navigate('/verify-otp', {
      state: { email: email.trim(), name: name.trim(), purpose: 'signup' },
    })
  }

  return (
    <div className="tt-authShell">
      <div className="tt-authCard">
        <section className="tt-authPanel">
          <div className="tt-authBackRow">
            <Link to="/get-started" className="tt-authBackLink">
              <BackChevron />
              <span>Back to Home</span>
            </Link>
            <div className="tt-authBrandInline">
              <Logo size={28} />
              <span>
                Teach<span className="tt-authBrandAccent">Track</span>
              </span>
            </div>
          </div>

          <header className="tt-authPanelHeader">
            <div className="tt-authEyebrow">New here</div>
            <h1 className="tt-authHeading">Create your account</h1>
            <p className="tt-authGreeting">Join TeachTrack and meet TeeTee, your teaching sidekick.</p>
          </header>

          <form className="tt-authForm" onSubmit={onSubmit} noValidate>
            <div className="tt-authField">
              <label htmlFor="name">Full name</label>
              <div className="tt-authInput">
                <UserIcon />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className="tt-authField">
              <label htmlFor="password">Password</label>
              <div className="tt-authInput">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="tt-authField">
              <label htmlFor="confirm">Confirm password</label>
              <div className="tt-authInput">
                <LockIcon />
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="tt-authActionsRow">
              <label className="tt-authCheckbox">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className="tt-authCta">
              Sign Up
            </button>
          </form>

          <div className="tt-authDivider">
            <span>or</span>
          </div>

          <div className="tt-authSocialRow">
            <button type="button" className="tt-authSocialBtn">
              <span className="tt-socialMark is-google">G</span>
              <span>Sign up with Google</span>
            </button>
            <button type="button" className="tt-authSocialBtn">
              <span className="tt-socialMark is-facebook">f</span>
              <span>Sign up with Facebook</span>
            </button>
          </div>

          <div className="tt-authSwitch">
            <span>Already with us?</span>
            <Link to="/login">Sign in</Link>
          </div>

          <p className="tt-authLegal">By creating an account, you agree to our terms of service and privacy policy.</p>
        </section>

        <AuthHero
          badges={['Plan · Run · Track', 'TeeTee approved']}
          chat={[
            { from: 'bot', text: 'Welcome! 🎉 Ready to start your teaching journey?' },
            { from: 'user', text: "Yes! I'm excited to join TeachTrack." },
            { from: 'bot', text: "Awesome — I'll help you build classes, quizzes, and attendance, all in one place." },
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

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.85" />
      <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.85" />
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}
