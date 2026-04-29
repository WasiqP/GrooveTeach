import './TestimonialCard.css'

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TestimonialCard({ quote, name, role, avatarColor }) {
  return (
    <figure className="mkt-testi">
      <blockquote className="mkt-testi-quote">{quote}</blockquote>
      <figcaption className="mkt-testi-meta">
        <span
          className="mkt-testi-avatar"
          style={avatarColor ? { background: avatarColor } : undefined}
          aria-hidden
        >
          {initialsOf(name)}
        </span>
        <span>
          <span className="mkt-testi-name">{name}</span>
          <br />
          <span className="mkt-testi-role">{role}</span>
        </span>
      </figcaption>
    </figure>
  )
}
