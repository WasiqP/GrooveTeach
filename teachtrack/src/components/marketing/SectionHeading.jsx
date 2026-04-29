import Reveal from './Reveal'
import './SectionHeading.css'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}) {
  const isCenter = align === 'center'
  return (
    <div className={`mkt-section-heading ${isCenter ? 'is-center' : ''}`}>
      {eyebrow ? (
        <Reveal>
          <span className="mkt-eyebrow">
            <span className="mkt-eyebrow-dot" aria-hidden />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      {title ? (
        <Reveal delay={0.05}>
          <h2 className="mkt-h2">{title}</h2>
        </Reveal>
      ) : null}
      {description ? (
        <Reveal delay={0.1}>
          <p className="mkt-lede">{description}</p>
        </Reveal>
      ) : null}
      {children}
    </div>
  )
}
