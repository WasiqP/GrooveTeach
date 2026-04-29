import './FeatureCard.css'

const TONE_CLASS = {
  violet: '',
  teal: 'mkt-feature-icon-teal',
  amber: 'mkt-feature-icon-amber',
  indigo: 'mkt-feature-icon-indigo',
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FeatureCard({
  icon,
  title,
  description,
  tone = 'violet',
  footer,
}) {
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mkt-mx', `${x}%`)
    e.currentTarget.style.setProperty('--mkt-my', `${y}%`)
  }

  return (
    <article className="mkt-feature" onMouseMove={handleMouseMove}>
      <div className={`mkt-feature-icon ${TONE_CLASS[tone] ?? ''}`}>{icon}</div>
      <h3 className="mkt-feature-title">{title}</h3>
      <p className="mkt-feature-desc">{description}</p>
      {footer ? (
        <span className="mkt-feature-foot">
          {footer}
          <ArrowIcon />
        </span>
      ) : null}
    </article>
  )
}
