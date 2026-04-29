import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Sync ScrollTrigger to Lenis if it's been mounted by useLenis().
 * Idempotent — safe to call from multiple components.
 */
function ensureLenisScrollerProxy() {
  const lenis = typeof window !== 'undefined' ? window.__teachtrack_lenis : null
  if (!lenis || lenis.__teachtrackScrollSyncBound) return
  lenis.on('scroll', ScrollTrigger.update)
  // Lenis already runs its own rAF loop (see useLenis()).
  // We only need to tell ScrollTrigger to update when Lenis scrolls.
  ScrollTrigger.refresh()
  lenis.__teachtrackScrollSyncBound = true
}

/**
 * Apply a scroll-triggered staggered "reveal from below" animation
 * to all elements with `data-reveal` inside the returned ref.
 *
 * Pattern:
 *   const ref = useGsapReveal()
 *   <section ref={ref}>
 *     <h2 data-reveal>Hello</h2>
 *     <p data-reveal>World</p>
 *   </section>
 */
export default function useGsapReveal({ start = 'top 85%', stagger = 0.1, y = 32 } = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const targets = root.querySelectorAll('[data-reveal]')
    if (!targets.length) return undefined

    if (reduced) {
      targets.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return undefined
    }

    ensureLenisScrollerProxy()

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [start, stagger, y])

  return containerRef
}
