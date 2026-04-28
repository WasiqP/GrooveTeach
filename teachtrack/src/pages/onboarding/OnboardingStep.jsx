import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Logo from '../../components/ui/Logo'
import './Onboarding.css'

export default function OnboardingStep({
  step,
  total = 3,
  illustration,
  title,
  description,
  nextTo,
  nextLabel = 'Continue',
  skipTo,
}) {
  return (
    <div className="tt-onboardStep">
      <div className="tt-onboardStepInner">
        <div className="tt-onboardIllustration" aria-hidden="true">
          {illustration ?? <Logo size={160} />}
        </div>

        <h1 className="tt-onboardStepTitle">{title}</h1>
        <p className="tt-onboardStepDesc">{description}</p>

        <div className="tt-onboardDots" aria-label={`Step ${step} of ${total}`}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`tt-onboardDot ${i + 1 === step ? 'is-active' : ''}`} />
          ))}
        </div>

        <div className="tt-onboardStepActions">
          <Button as={Link} to={nextTo} fullWidth>
            {nextLabel}
          </Button>
          {skipTo ? (
            <Button as={Link} to={skipTo} variant="secondary" fullWidth>
              Skip
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
