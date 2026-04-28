import { Link } from 'react-router-dom'
import TopBar from '../../../components/layout/TopBar'
import Button from '../../../components/ui/Button'
import { useAppSettings, LANGUAGE_OPTIONS } from '../../../context/AppSettingsContext'
import { usePulseAlert } from '../../../context/PulseAlertContext'
import '../Dashboard.css'

export default function LanguageSettings() {
  const { language, setLanguage } = useAppSettings()
  const { showAlert } = usePulseAlert()

  const choose = (opt) => {
    if (!opt.ready) {
      showAlert({
        title: `${opt.label} coming soon`,
        message: 'TeeTee is still translating. We’ll switch you over when it’s ready.',
        variant: 'warning',
      })
      return
    }
    setLanguage(opt.code)
  }

  return (
    <>
      <TopBar
        subtitle="Settings"
        title="Language"
        right={
          <Button as={Link} to="/app/settings" size="sm" variant="outline">
            Back
          </Button>
        }
      />

      <Link to="/app/settings" className="tt-backLink">← Settings</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Language</div>
          <div className="tt-titleSection">Choose your TeachTrack language</div>

          <div className="tt-cardRowList">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.code
              return (
                <button
                  key={opt.code}
                  type="button"
                  className="tt-row tt-rowLink"
                  onClick={() => choose(opt)}
                  style={{
                    background: 'transparent',
                    border: 0,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div className={`tt-rowIcon ${active ? 'tt-rowIcon-teal' : ''}`}>
                    {active ? '✓' : opt.code.toUpperCase()}
                  </div>
                  <div className="tt-rowBody">
                    <div className="tt-rowTitle">{opt.label}</div>
                    <div className="tt-rowMeta">
                      {opt.nativeLabel}
                      {!opt.ready ? ' · coming soon' : ''}
                    </div>
                  </div>
                  <div className="tt-rowEnd">
                    <span
                      className={`tt-pill ${active ? 'tt-pill-graded' : 'tt-pill-pending'}`}
                    >
                      {active ? 'Active' : opt.ready ? 'Switch' : 'Soon'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
