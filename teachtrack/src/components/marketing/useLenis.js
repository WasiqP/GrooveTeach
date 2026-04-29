import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Mounts a single Lenis smooth-scroll instance for the marketing site.
 *
 * - Reuses one rAF loop, cleaned up on unmount.
 * - Disables itself when the user prefers reduced motion.
 * - Exposes a global `__teachtrack_lenis` so GSAP ScrollTrigger can sync.
 */
export default function useLenis() {
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    })

    window.__teachtrack_lenis = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__teachtrack_lenis === lenis) {
        delete window.__teachtrack_lenis
      }
    }
  }, [])
}
