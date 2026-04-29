import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import './MarketingNav.css'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className={`mkt-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="mkt-nav-inner">
          <Link to="/" className="mkt-brand" aria-label="TeachTrack home">
            <span className="mkt-brand-mark" aria-hidden>
              <Logo size={32} alt="" />
            </span>
            <span className="mkt-brand-text">
              Teach<em>Track</em>
            </span>
          </Link>

          <nav className="mkt-nav-links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mkt-nav-link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mkt-nav-cta">
            <Button as={Link} to="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Button
              as={Link}
              to="/signup"
              size="sm"
              className="mkt-btn-glow"
            >
              Start free
            </Button>
            <button
              type="button"
              className={`mkt-nav-toggle ${mobileOpen ? 'is-open' : ''}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            key="mobile-nav"
            className="mkt-nav-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Mobile primary"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mkt-nav-link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mkt-nav-mobile-actions">
              <Button as={Link} to="/login" variant="secondary">
                Log in
              </Button>
              <Button as={Link} to="/signup" className="mkt-btn-glow">
                Start free
              </Button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  )
}
