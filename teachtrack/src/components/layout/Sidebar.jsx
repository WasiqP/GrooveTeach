import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/app', end: true, label: 'Home', icon: HomeIcon },
  { to: '/app/classes', label: 'Classes', icon: ClassIcon },
  { to: '/app/quizzes', label: 'Quizzes', icon: QuizIcon },
  { to: '/app/grades', label: 'Grades', icon: GradesIcon },
  { to: '/app/lesson-planner', label: 'Lessons', icon: LessonIcon },
  { to: '/app/attendance', label: 'Attendance', icon: AttendanceIcon },
]

const FOOTER_ITEMS = [
  { to: '/app/profile', label: 'Profile', icon: ProfileIcon },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const { firstName } = useUser()

  return (
    <aside className="tt-sidebar" aria-label="Primary navigation">
      <div className="tt-sidebarBrand">
        <Logo size={48} />
        <div className="tt-sidebarBrandText">
          <div className="tt-sectionLabel">TeachTrack</div>
          <div className="tt-label">Hi, {firstName || 'Teacher'}</div>
        </div>
      </div>

      <nav className="tt-sidebarNav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `tt-navItem ${isActive ? 'is-active' : ''}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="tt-sidebarFooter">
        {FOOTER_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `tt-navItem ${isActive ? 'is-active' : ''}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button type="button" className="tt-navItem tt-navLogout" onClick={logout}>
          <LogoutIcon />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V19c0 .97-.78 1.75-1.75 1.75h-3.5c-.69 0-1.25-.56-1.25-1.25v-3.75h-3.5v3.75c0 .69-.56 1.25-1.25 1.25H5.75C4.78 20.75 4 19.97 4 19v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ClassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 10.5 12 5l10 5.5-10 5L2 10.5Z" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M6 12.5V17c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M22 10v2" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function QuizIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3.5h6l1 2h3.25c.97 0 1.75.78 1.75 1.75v12.5c0 .97-.78 1.75-1.75 1.75H5.75C4.78 21.5 4 20.72 4 19.75V7.25C4 6.28 4.78 5.5 5.75 5.5H8l1-2Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function GradesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M18 4H6v7a6 6 0 0 0 12 0V4Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function LessonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h10l4 4v12H5V4Z" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
      <path d="M14 4v5h5" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
      <path d="M8 13h8M8 16.5h6" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function AttendanceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5h14v14H5z" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.85" />
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.85" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.05 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.66 15 1.7 1.7 0 0 0 3.1 13.95H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.66 1.7 1.7 0 0 0 10.05 3.1V3a2 2 0 1 1 4 0v.09c.01.66.4 1.26 1 1.51.61.25 1.32.11 1.82-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.34 9c.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66.01-1.26.4-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M9 16l-4-4 4-4" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M5 12h11" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </svg>
  )
}
