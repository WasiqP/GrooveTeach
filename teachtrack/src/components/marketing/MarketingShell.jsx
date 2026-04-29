import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MarketingNav from './MarketingNav'
import MarketingFooter from './MarketingFooter'
import useLenis from './useLenis'
import '../../pages/marketing/Marketing.css'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const PAGE_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
}

export default function MarketingShell() {
  useLenis()
  const location = useLocation()

  useEffect(() => {
    const lenis = window.__teachtrack_lenis
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [location.pathname])

  return (
    <div className="mkt-page">
      <MarketingNav />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={PAGE_TRANSITION}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <MarketingFooter />
    </div>
  )
}
