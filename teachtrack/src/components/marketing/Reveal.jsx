import { motion, useReducedMotion } from 'framer-motion'

/**
 * Wraps children in an in-view fade-and-rise.
 * Use for sections / cards / illustrations that should animate when they enter.
 *
 * Props:
 *   delay     start delay in seconds
 *   y         translateY in px (default 28)
 *   amount    framer-motion in-view amount (default 0.2)
 *   once      defaults true (only animates first time)
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  amount = 0.2,
  once = true,
  as: Component = 'div',
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Component] || motion.div

  if (reduce) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
