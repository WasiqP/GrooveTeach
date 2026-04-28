import OnboardingStep from './OnboardingStep'

export default function Onboarding03() {
  return (
    <OnboardingStep
      step={3}
      title="Track what matters"
      description="Mark attendance, follow class activity, and keep your teaching week organized—from one clear dashboard."
      nextTo="/signup"
      nextLabel="Get Started"
    />
  )
}
