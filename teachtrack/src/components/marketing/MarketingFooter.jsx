import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import './MarketingFooter.css'

const PRODUCT_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Log in' },
]

const RESOURCES_LINKS = [
  { to: '/about', label: 'Our story' },
  { to: '/pricing', label: 'For schools' },
  { to: '/contact', label: 'Support' },
  { to: '/contact', label: 'Press' },
]

const LEGAL_LINKS = [
  { to: '/app/settings/privacy', label: 'Privacy' },
  { to: '/app/settings/terms', label: 'Terms' },
  { to: '/app/settings/about', label: 'About app' },
]

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18.244 2H21l-6.51 7.44L22 22h-6.83l-4.76-6.22L4.78 22H2l6.96-7.95L2 2h7l4.3 5.7L18.244 2Zm-1.2 18h1.71L7.05 4H5.23l11.81 16Z" fill="currentColor" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75ZM10 9.75h3.83v1.55h.05c.53-1 1.83-2.05 3.77-2.05 4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.94c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z" fill="currentColor" />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.6 2 12.27c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.79.62-3.38-1.37-3.38-1.37-.46-1.18-1.12-1.5-1.12-1.5-.91-.64.07-.62.07-.62 1.01.07 1.55 1.06 1.55 1.06.9 1.58 2.36 1.13 2.94.86.09-.67.35-1.13.64-1.39-2.23-.26-4.57-1.14-4.57-5.07 0-1.12.39-2.04 1.04-2.76-.1-.26-.45-1.31.1-2.74 0 0 .85-.28 2.79 1.05A9.5 9.5 0 0 1 12 7.07c.86 0 1.73.12 2.54.35 1.94-1.33 2.79-1.05 2.79-1.05.55 1.43.2 2.48.1 2.74.65.72 1.04 1.64 1.04 2.76 0 3.94-2.34 4.81-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49C19.13 20.64 22 16.8 22 12.27 22 6.6 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function MarketingFooter() {
  return (
    <footer className="mkt-footer">
      <div className="mkt-footer-grid">
        <div className="mkt-footer-brand">
          <Link to="/" className="mkt-brand" aria-label="TeachTrack home">
            <span className="mkt-brand-mark" aria-hidden>
              <Logo size={36} alt="" />
            </span>
            <span className="mkt-brand-text">
              Teach<em>Track</em>
            </span>
          </Link>
          <p>
            The AI teaching assistant that quietly handles classes, attendance,
            quizzes, and grading — so teachers can teach.
          </p>
        </div>

        <div className="mkt-footer-col">
          <h4>Product</h4>
          <ul>
            {PRODUCT_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mkt-footer-col">
          <h4>Resources</h4>
          <ul>
            {RESOURCES_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mkt-footer-col">
          <h4>Company</h4>
          <ul>
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mkt-footer-bottom">
        <span className="mkt-footer-meta">
          © {new Date().getFullYear()} TeachTrack. Built for teachers.
        </span>
        <div className="mkt-footer-socials" aria-label="Social links">
          <a className="mkt-footer-social" href="#" aria-label="Twitter / X">
            <IconTwitter />
          </a>
          <a className="mkt-footer-social" href="#" aria-label="LinkedIn">
            <IconLinkedIn />
          </a>
          <a className="mkt-footer-social" href="#" aria-label="GitHub">
            <IconGitHub />
          </a>
        </div>
      </div>
    </footer>
  )
}
