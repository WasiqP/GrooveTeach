import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './TopBar.css'

export default function TopBar({ title, subtitle, right }) {
  const { initials } = useUser()

  return (
    <header className="tt-topbar">
      <div className="tt-topbarText">
        {subtitle ? <div className="tt-sectionLabel">{subtitle}</div> : null}
        <h1 className="tt-titleLarge">{title}</h1>
      </div>

      <div className="tt-topbarRight">
        {right}
        <Link to="/app/profile" className="tt-avatar" aria-label="Profile">
          <span>{initials}</span>
        </Link>
      </div>
    </header>
  )
}
