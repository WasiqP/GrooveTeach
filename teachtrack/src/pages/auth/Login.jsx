import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import AuthHero from './AuthHero'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    login({ email: email.trim() })
    const to = location.state?.from?.pathname || '/app'
    navigate(to, { replace: true })
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
            <div className="tt-authEyebrow">Welcome back</div>
            <h1 className="tt-authHeading">Sign in to TeachTrack</h1>
            <p className="tt-authGreeting">Pick up where you left off—classes, quizzes, and attendance, all in one place.</p>
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

            <div className="tt-authField">
              <label htmlFor="password">Password</label>
              <div className="tt-authInput">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="tt-authActionsRow">
              <label className="tt-authCheckbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="tt-authLink">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="tt-authCta">
              Sign In
            </button>
          </form>

          <div className="tt-authDivider">
            <span>or</span>
          </div>

          <div className="tt-authSocialRow">
            <button type="button" className="tt-authSocialBtn">
              <span className="tt-socialMark is-google">G</span>
              <span>Sign in with Google</span>
            </button>
            <button type="button" className="tt-authSocialBtn">
              <span className="tt-socialMark is-facebook">f</span>
              <span>Sign in with Facebook</span>
            </button>
          </div>

          <div className="tt-authSwitch">
            <span>New here?</span>
            <Link to="/signup">Create an account</Link>
          </div>

          <p className="tt-authLegal">By logging in, you agree to our terms of service and privacy policy.</p>
        </section>

        <AuthHero
          badges={['Built for teachers', 'TeeTee inside']}
          chat={[
            { from: 'bot', text: 'Hi! I’m TeeTee. Sign in and I’ll bring back your classes & today’s tasks.' },
            { from: 'user', text: 'Perfect — let’s get to work.' },
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
