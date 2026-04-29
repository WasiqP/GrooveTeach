import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedText from '../../components/marketing/AnimatedText'
import Reveal from '../../components/marketing/Reveal'
import SectionHeading from '../../components/marketing/SectionHeading'
import Button from '../../components/ui/Button'
import './Blog.css'

const POSTS = [
  {
    id: 'calm-week',
    tone: 'violet',
    featured: true,
    title: 'How to get six hours back each week (without working harder)',
    excerpt:
      'A calm workflow is not a productivity hack. It’s fewer tools, fewer tabs, and a single place where class context lives.',
    tag: 'Workflow',
    date: 'Apr 2026',
    read: '6 min read',
  },
  {
    id: 'attendance-patterns',
    tone: 'teal',
    title: 'Attendance patterns: what to track beyond “present/absent”',
    excerpt:
      'A simple week view can surface trends early. Here’s what matters and what doesn’t.',
    tag: 'Attendance',
    date: 'Apr 2026',
    read: '5 min read',
  },
  {
    id: 'ai-drafts',
    tone: 'violet',
    title: 'Drafted, not dictated: how we think about AI in teaching',
    excerpt:
      'AI should write the first draft and get out of the way. You keep the voice, the decisions, and the responsibility.',
    tag: 'AI',
    date: 'Mar 2026',
    read: '7 min read',
  },
  {
    id: 'quiz-links',
    tone: 'amber',
    title: 'Shareable quiz links that students can open instantly',
    excerpt:
      'Make quizzes feel effortless: link-first, low friction, and clear response tracking.',
    tag: 'Quizzes',
    date: 'Mar 2026',
    read: '4 min read',
  },
  {
    id: 'report-comments',
    tone: 'teal',
    title: 'Parent-friendly reports: a template that saves time',
    excerpt:
      'Good reporting is consistent, specific, and short. Here’s a practical structure you can reuse.',
    tag: 'Reports',
    date: 'Feb 2026',
    read: '6 min read',
  },
  {
    id: 'teacher-led',
    tone: 'violet',
    title: 'Teacher-led product design: what we learned from pilots',
    excerpt:
      'The best features are the ones that quietly reduce steps. Here are the patterns teachers consistently asked for.',
    tag: 'Product',
    date: 'Feb 2026',
    read: '8 min read',
  },
]

const TAGS = ['All', 'Workflow', 'Attendance', 'AI', 'Quizzes', 'Reports', 'Product']

function PostCard({ post }) {
  return (
    <article className={`mkt-blog-card is-${post.tone}`}>
      <div className="mkt-blog-cardTop">
        <span className="mkt-blog-tag">{post.tag}</span>
        <span className="mkt-blog-meta">
          {post.date} · {post.read}
        </span>
      </div>
      <h3 className="mkt-blog-cardTitle">{post.title}</h3>
      <p className="mkt-blog-cardExcerpt">{post.excerpt}</p>
      <div className="mkt-blog-cardActions">
        <Button as={Link} to="/contact" size="sm" variant="ghost">
          Read article
        </Button>
        <span className="mkt-blog-cardArrow" aria-hidden>
          →
        </span>
      </div>
    </article>
  )
}

export default function MarketingBlog() {
  const featured = POSTS.find((p) => p.featured) || POSTS[0]
  const rest = POSTS.filter((p) => p.id !== featured.id)

  return (
    <div className="mkt-blog">
      <section className="mkt-blog-hero">
        <div className="mkt-aurora" aria-hidden />
        <div className="mkt-grid-bg" aria-hidden />
        <div className="mkt-blog-heroShell">
          <Reveal>
            <span className="mkt-eyebrow">
              <span className="mkt-eyebrow-dot" aria-hidden />
              TeachTrack Blog
            </span>
          </Reveal>
          <AnimatedText
            as="h1"
            text="Ideas for calmer teaching."
            highlight={['calmer']}
            stagger={0.06}
          />
          <Reveal delay={0.15}>
            <p className="mkt-lede">
              Practical workflows, product updates, and teacher-first thinking —
              written for the real week, not the demo week.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mkt-blog-controls" aria-label="Blog controls">
              <div className="mkt-blog-search">
                <span className="mkt-blog-searchIco" aria-hidden>
                  ⌕
                </span>
                <input
                  type="search"
                  placeholder="Search articles (coming soon)"
                  aria-label="Search articles"
                  disabled
                />
              </div>
              <div className="mkt-blog-chips" aria-label="Categories">
                {TAGS.map((t) => (
                  <button key={t} type="button" className={`mkt-blog-chip ${t === 'All' ? 'is-active' : ''}`} disabled>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mkt-blog-featured" aria-label="Featured article">
        <div className="mkt-shell">
          <div className="mkt-blog-featuredGrid">
            <Reveal>
              <div className="mkt-blog-featuredCard">
                <div className="mkt-blog-featuredTop">
                  <span className="mkt-blog-tag">Featured · {featured.tag}</span>
                  <span className="mkt-blog-meta">
                    {featured.date} · {featured.read}
                  </span>
                </div>
                <h2 className="mkt-h2">{featured.title}</h2>
                <p className="mkt-blog-featuredExcerpt">{featured.excerpt}</p>
                <div className="mkt-blog-featuredActions">
                  <Button as={Link} to="/contact" className="mkt-btn-glow">
                    Read featured
                  </Button>
                  <Button as={Link} to="/signup" variant="secondary">
                    Start free
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mkt-blog-featuredArt" aria-hidden>
                <div className="mkt-blog-artTop">
                  <span className="mkt-blog-artPill">Calm checklist</span>
                  <span className="mkt-blog-artPill is-soft">Week view</span>
                </div>
                <div className="mkt-blog-artLines">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="mkt-blog-artRow">
                  <b>Saved time</b>
                  <span>6 hrs</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mkt-blog-list" aria-label="All posts">
        <div className="mkt-shell">
          <SectionHeading
            eyebrow="Latest"
            title="Fresh reads for the real week"
            description="Short, practical articles. No fluff. No guilt."
          />

          <motion.div
            className="mkt-blog-grid"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mkt-blog-news" aria-label="Newsletter">
        <div className="mkt-shell">
          <Reveal>
            <div className="mkt-blog-newsCard">
              <div className="mkt-blog-newsCopy">
                <span className="mkt-eyebrow" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' }}>
                  <span className="mkt-eyebrow-dot" aria-hidden />
                  Monthly digest
                </span>
                <h2 className="mkt-h2">Calm ideas, once a month.</h2>
                <p>
                  A short email with one workflow, one template, and one product update. No spam.
                </p>
              </div>

              <form className="mkt-blog-newsForm" onSubmit={(e) => e.preventDefault()}>
                <label className="mkt-blog-newsLabel">
                  <span>Email</span>
                  <input type="email" placeholder="you@school.edu" aria-label="Email" />
                </label>
                <Button type="submit" className="mkt-btn-glow">
                  Subscribe
                </Button>
                <span className="mkt-blog-newsFine">
                  Coming soon — this form is a design placeholder.
                </span>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

