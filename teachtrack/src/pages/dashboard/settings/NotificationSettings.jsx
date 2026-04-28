import { Link } from 'react-router-dom'
import TopBar from '../../../components/layout/TopBar'
import Button from '../../../components/ui/Button'
import { useAppSettings } from '../../../context/AppSettingsContext'
import '../Dashboard.css'

const CHANNELS = [
  {
    key: 'taskReminders',
    title: 'Task reminders',
    meta: 'TeeTee nudges you when something is due soon.',
  },
  {
    key: 'gradeUpdates',
    title: 'Grade updates',
    meta: 'Heads-up when a student submits or you have grades to enter.',
  },
  {
    key: 'classAnnouncements',
    title: 'Class announcements',
    meta: 'Confirmation when announcements are posted to a class.',
  },
]

export default function NotificationSettings() {
  const { notifications, setNotificationPrefs } = useAppSettings()

  return (
    <>
      <TopBar
        subtitle="Settings"
        title="Notifications"
        right={
          <Button as={Link} to="/app/settings" size="sm" variant="outline">
            Back
          </Button>
        }
      />

      <Link to="/app/settings" className="tt-backLink">← Settings</Link>

      <section className="tt-dashSection">
        <div className="tt-card">
          <div className="tt-sectionLabel">Channels</div>
          <div className="tt-titleSection">Choose how TeachTrack reaches you</div>
          {CHANNELS.map((c) => (
            <div key={c.key} className="tt-toggleRow">
              <div>
                <div className="tt-rowTitle">{c.title}</div>
                <div className="tt-rowMeta">{c.meta}</div>
              </div>
              <button
                type="button"
                className={`tt-toggle ${notifications[c.key] ? 'tt-toggle-on' : ''}`}
                onClick={() =>
                  setNotificationPrefs({ [c.key]: !notifications[c.key] })
                }
                aria-label={`Toggle ${c.title}`}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
