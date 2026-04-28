import OnboardingStep from './OnboardingStep'

export default function Onboarding02() {
  return (
    <OnboardingStep
      step={2}
      title="Plan and assign in one place"
      description="Create classes, build tasks and quizzes, and keep everything tied to the right group—without spreadsheets or a pile of separate apps."
      nextTo="/onboarding/3"
      skipTo="/login"
    />
  )
}
