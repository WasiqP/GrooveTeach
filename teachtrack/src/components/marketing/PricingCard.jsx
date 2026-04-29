import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import './PricingCard.css'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4 4 10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Pricing card.
 *
 * Props:
 *   name        plan name
 *   description short tagline
 *   price       string already formatted ('0', '8', '14', etc.) or 'Custom'
 *   cents       optional cents string ('.00')
 *   period      e.g. '/teacher / month'
 *   features    array of feature strings
 *   cta         { label, to }
 *   featured    boolean — highlights the plan
 *   badge       text shown next to name when featured
 */
export default function PricingCard({
  name,
  description,
  price,
  cents,
  period,
  features = [],
  cta,
  featured = false,
  badge,
}) {
  return (
    <article className={`mkt-pricing ${featured ? 'is-featured' : ''}`}>
      <div className="mkt-pricing-head">
        <h3 className="mkt-pricing-name">{name}</h3>
        {featured && badge ? (
          <span className="mkt-pricing-badge">{badge}</span>
        ) : null}
      </div>

      <div className="mkt-pricing-price">
        {price !== 'Custom' ? (
          <>
            <span className="mkt-pricing-currency">$</span>
            <span>{price}</span>
            {cents ? <span className="mkt-pricing-cents">{cents}</span> : null}
            {period ? <span className="mkt-pricing-period">{period}</span> : null}
          </>
        ) : (
          <span>Custom</span>
        )}
      </div>

      {description ? <p className="mkt-pricing-desc">{description}</p> : null}

      <ul className="mkt-pricing-features">
        {features.map((feature) => (
          <li key={feature} className="mkt-pricing-feature">
            <span className="mkt-pricing-bullet" aria-hidden>
              <CheckIcon />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mkt-pricing-cta">
        <Button
          as={Link}
          to={cta.to}
          variant={featured ? 'secondary' : 'primary'}
          className={featured ? '' : 'mkt-btn-glow'}
        >
          {cta.label}
        </Button>
      </div>
    </article>
  )
}
