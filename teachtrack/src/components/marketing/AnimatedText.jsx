import { motion, useReducedMotion } from 'framer-motion'

/**
 * Word-by-word animated headline.
 *
 * Usage:
 *   <AnimatedText text="Your AI Teaching Assistant" as="h1" className="mkt-display" />
 */
export default function AnimatedText({
  text,
  as: Component = 'span',
  delay = 0,
  stagger = 0.06,
  className = '',
  highlight = [],
  highlightClass = 'mkt-grad',
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const highlightSet = new Set(highlight)

  if (reduce) {
    return (
      <Component className={className}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className={highlightSet.has(word) ? highlightClass : undefined}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Component>
    )
  }

  const MotionTag = motion[Component] || motion.span

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      variants={{
        hidden: {},
        show: {},
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            paddingBottom: '0.08em',
            marginBottom: '-0.08em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            className={highlightSet.has(word) ? highlightClass : undefined}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
