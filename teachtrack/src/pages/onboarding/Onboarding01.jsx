import OnboardingStep from './OnboardingStep'

export default function Onboarding01() {
  return (
    <OnboardingStep
      step={1}
      title="Welcome to TeachTrack"
      description="Your assistant for lesson planning, quizzes, and attendance—so you spend less time on admin and more with students."
      nextTo="/onboarding/2"
      skipTo="/login"
    />
  )
}
