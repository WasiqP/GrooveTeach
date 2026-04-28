import { Link } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useAppSettings, languageLabel } from '../../context/AppSettingsContext'
import { useUser } from '../../context/UserContext'
import './Dashboard.css'

export default function Settings() {
  const { logout } = useAuth()
  const { language, notifications } = useAppSettings()
  const { displayName, initials } = useUser()

  const enabledCount = Object.values(notifications).filter(Boolean).length

  const items = [
    {
      to: '/app/profile',
      title: 'Profile',
      meta: displayName ? `Edit your details — ${displayName}` : 'Add your name, email and avatar',
    },
    {
      to: '/app/settings/notifications',
      title: 'Notifications',
      meta: `${enabledCount} of 3 channels on`,
    },
    {
      to: '/app/settings/language',
      title: 'Language',
      meta: languageLabel(language),
    },
    { to: '/app/settings/help', title: 'Help & Support', meta: 'Reach the TeeTee crew' },
    { to: '/app/settings/about', title: 'About TeachTrack', meta: 'Version, blurb, mascot' },
    { to: '/app/settings/terms', title: 'Terms of Service', meta: 'How we work together' },
    { to: '/app/settings/privacy', title: 'Privacy Policy', meta: 'How we handle your data' },
  ]

  return (
    <>
      <TopBar subtitle="Settings" title="Preferences" />

      <section className="tt-dashSection">
        <Link to="/app/profile" className="tt-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="tt-sectionLabel">Account</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="tt-rowIcon tt-rowIcon-violet"
              style={{ width: 56, height: 56, fontSize: 18 }}
            >
              {initials}
            </div>
            <div className="tt-rowBody">
              <div className="tt-rowTitle">{displayName || 'Add your profile'}</div>
              <div className="tt-rowMeta">Tap to edit your details and avatar.</div>
            </div>
            <div className="tt-rowEnd">›</div>
          </div>
        </Link>

        <div className="tt-card">
          <div className="tt-sectionLabel">App</div>
          <div className="tt-titleSection">Manage TeachTrack</div>
          <div className="tt-cardRowList">
            {items.slice(1).map((it) => (
              <Link key={it.to} to={it.to} className="tt-row tt-rowLink" style={{ color: 'inherit' }}>
                <div className="tt-rowIcon">›</div>
                <div className="tt-rowBody">
                  <div className="tt-rowTitle">{it.title}</div>
                  <div className="tt-rowMeta">{it.meta}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="tt-actionsRow tt-mt-12">
            <Button variant="secondary" onClick={logout}>Log out</Button>
          </div>
        </div>
      </section>
    </>
  )
}
