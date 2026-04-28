import { useState } from 'react'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useUser } from '../../context/UserContext'
import { usePulseAlert } from '../../context/PulseAlertContext'
import './Dashboard.css'

export default function Profile() {
  const { profile, updateProfile, initials } = useUser()
  const { showSuccess } = usePulseAlert()

  const [draft, setDraft] = useState(profile)

  const setField = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }))

  const onAvatarPick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setDraft((d) => ({ ...d, avatarUri: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const onSave = (e) => {
    e.preventDefault()
    updateProfile(draft)
    showSuccess('Saved', 'Your profile is up to date.')
  }

  return (
    <>
      <TopBar subtitle="Profile" title="Your profile" />

      <section className="tt-dashSection">
        <form className="tt-card" onSubmit={onSave}>
          <div className="tt-sectionLabel">Identity</div>
          <div className="tt-titleSection">Profile photo</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 999,
                border: '2px solid var(--ink-borderInk)',
                background: draft.avatarUri ? `url(${draft.avatarUri}) center/cover` : 'var(--primary-soft)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 28,
                flex: '0 0 auto',
              }}
            >
              {!draft.avatarUri ? initials : null}
            </div>

            <div style={{ flex: 1 }}>
              <div className="tt-rowTitle">{draft.displayName || 'Add your name'}</div>
              <div className="tt-rowMeta">{draft.email || 'No email'}</div>
              <label
                className="tt-chip"
                style={{ marginTop: 10, display: 'inline-block', cursor: 'pointer' }}
              >
                Choose photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarPick}
                  style={{ display: 'none' }}
                />
              </label>
              {draft.avatarUri ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setDraft((d) => ({ ...d, avatarUri: null }))}
                  style={{ marginLeft: 8 }}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        </form>

        <form className="tt-card" onSubmit={onSave}>
          <div className="tt-sectionLabel">About you</div>
          <div className="tt-titleSection">Display info</div>
          <div className="tt-formGrid">
            <Input
              label="Display name"
              value={draft.displayName}
              onChange={setField('displayName')}
              placeholder="e.g. Sara Khan"
            />
            <Input
              label="Email"
              value={draft.email}
              onChange={setField('email')}
              type="email"
              placeholder="you@school.edu"
            />
            <Input
              label="Phone"
              value={draft.phone}
              onChange={setField('phone')}
              placeholder="+1 …"
            />
            <Input
              label="Country"
              value={draft.country}
              onChange={setField('country')}
              placeholder="e.g. United States"
            />
            <Input
              label="City"
              value={draft.city}
              onChange={setField('city')}
              placeholder="e.g. Boston"
            />
            <Input
              label="Address"
              value={draft.address}
              onChange={setField('address')}
              placeholder="Street, suite…"
            />
          </div>
        </form>

        <form className="tt-card" onSubmit={onSave}>
          <div className="tt-sectionLabel">Work</div>
          <div className="tt-titleSection">Where you teach</div>
          <div className="tt-formGrid">
            <Input
              label="Institution"
              value={draft.institutionName}
              onChange={setField('institutionName')}
              placeholder="e.g. Westside Academy"
            />
            <Input
              label="Title"
              value={draft.professionalTitle}
              onChange={setField('professionalTitle')}
              placeholder="e.g. Mathematics teacher"
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Subjects you teach"
                value={draft.subjectsTeach}
                onChange={setField('subjectsTeach')}
                placeholder="e.g. Algebra, Geometry"
              />
            </div>
          </div>

          <div className="tt-actionsRow">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </section>
    </>
  )
}
