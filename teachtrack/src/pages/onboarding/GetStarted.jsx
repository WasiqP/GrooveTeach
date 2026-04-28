import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Logo from '../../components/ui/Logo'
import './Onboarding.css'

export default function GetStarted() {
  return (
    <div className="tt-onboardScreen">
      <div className="tt-onboardInner">
        <div className="tt-onboardHero">
          <Logo size={220} />
          <div className="tt-sectionLabel">Welcome to TeachTrack</div>
          <h1 className="tt-onboardTitle">
            <span>Teach</span>
            <span className="tt-onboardTitleAccent">Track</span>
          </h1>
          <p className="tt-onboardLede">
            Meet <span className="tt-underline">TeeTee</span>—your owl assistant. Plan classes, run quizzes, and track
            attendance, without jumping between apps.
          </p>
        </div>

        <div className="tt-onboardDivider" />

        <div className="tt-onboardCta">
          <Button as={Link} to="/onboarding/1" fullWidth>
            Get Started
          </Button>
          <Button as={Link} to="/login" variant="secondary" fullWidth>
            Log In
          </Button>
        </div>
      </div>
    </div>
  )
}
