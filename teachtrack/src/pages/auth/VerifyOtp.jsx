import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import AuthHero from './AuthHero'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

const LENGTH = 6

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signUp } = useAuth()
  const inputs = useRef([])
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))

  const email = location.state?.email
  const purpose = location.state?.purpose === 'reset' ? 'reset' : 'signup'
  const name = location.state?.name

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  if (!email) {
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
              <div className="tt-authEyebrow">Verify email</div>
              <h1 className="tt-authHeading">Nothing to verify</h1>
              <p className="tt-authGreeting">Start at sign-up or forgot password.</p>
            </header>

            <div className="tt-authSwitch">
              <span>Take me to</span>
              <Link to="/login">Login</Link>
            </div>
          </section>

          <AuthHero badges={['Secure 6-digit code']} chat={[{ from: 'bot', text: 'Need a fresh start? Pick Sign up or Forgot password from Login.' }]} />
        </div>
      </div>
    )
  }

  const updateDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < LENGTH - 1) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length !== LENGTH) return
    if (purpose === 'signup') {
      signUp({ email, name })
      navigate('/app', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="tt-authShell">
      <div className="tt-authCard">
        <section className="tt-authPanel">
          <div className="tt-authBackRow">
            <Link to={purpose === 'signup' ? '/signup' : '/forgot-password'} className="tt-authBackLink">
              <BackChevron />
              <span>Back</span>
            </Link>
            <div className="tt-authBrandInline">
              <Logo size={28} />
              <span>
                Teach<span className="tt-authBrandAccent">Track</span>
              </span>
            </div>
          </div>

          <header className="tt-authPanelHeader">
            <div className="tt-authEyebrow">Verify email</div>
            <h1 className="tt-authHeading">Enter the 6-digit code</h1>
            <p className="tt-authGreeting">
              We sent a code to <strong>{email}</strong>. Enter it below to{' '}
              {purpose === 'signup' ? 'finish creating your account' : 'reset your password'}.
            </p>
          </header>

          <form className="tt-authForm" onSubmit={onSubmit} noValidate>
            <div className="tt-otpRow" role="group" aria-label="Verification code">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  onChange={(e) => updateDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="tt-otpBox"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <button type="submit" className="tt-authCta">
              Verify
            </button>
          </form>

          <div className="tt-authSwitch">
            <span>Didn’t get a code?</span>
            <Link to={purpose === 'signup' ? '/signup' : '/forgot-password'}>Resend</Link>
          </div>
        </section>

        <AuthHero
          badges={['6-digit code', 'Quick verify']}
          chat={[
            { from: 'bot', text: 'Pop the code in and we’ll get you back to teaching.' },
            { from: 'user', text: 'Sending it now.' },
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
