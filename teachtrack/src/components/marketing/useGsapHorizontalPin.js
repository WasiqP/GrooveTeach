import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pins a section and scrolls a horizontal track as the page scrolls.
 *
 * Structure expected inside `rootRef`:
 *   - an element with [data-pin] (pinned)
 *   - inside it an element with [data-track] (translated on x)
 *
 * Mobile: caller should skip mounting this hook (or it self-disables).
 */
export default function useGsapHorizontalPin({ disabled = false } = {}) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || disabled) return undefined

    const isDesktop =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(min-width: 980px)').matches
    if (!isDesktop) return undefined

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) return undefined

    const pinEl = root.querySelector('[data-pin]')
    const trackEl = root.querySelector('[data-track]')
    if (!pinEl || !trackEl) return undefined

    const ctx = gsap.context(() => {
      const update = () => {
        const maxX = Math.max(0, trackEl.scrollWidth - pinEl.clientWidth)
        gsap.set(trackEl, { x: 0 })
        ScrollTrigger.getById('tt-mkt-rail')?.kill()

        ScrollTrigger.create({
          id: 'tt-mkt-rail',
          trigger: root,
          start: 'top top',
          end: () => `+=${Math.max(420, maxX)}`,
          pin: pinEl,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.to(trackEl, {
              x: -maxX * self.progress,
              duration: 0.1,
              overwrite: true,
              ease: 'none',
            })
          },
        })
      }

      update()
      ScrollTrigger.addEventListener('refreshInit', update)
      ScrollTrigger.refresh()

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', update)
      }
    }, root)

    return () => ctx.revert()
  }, [disabled])

  return rootRef
}

