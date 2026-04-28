import Logo from '../../components/ui/Logo'

export default function AuthHero({ badges = [], chat = [] }) {
  return (
    <aside className="tt-authHero" aria-hidden="true">
      <div className="tt-authHeroCard">
        <div className="tt-authHeroBadgeRow">
          {badges.map((b, i) => (
            <span className="tt-authHeroBadge" key={i}>
              {b}
            </span>
          ))}
        </div>

        <div className="tt-authHeroOwl">
          <Logo size={300} alt="TeeTee — TeachTrack mascot" />
        </div>

        <div className="tt-authChat">
          {chat.map((m, i) => (
            <div key={i} className={`tt-authBubble ${m.from === 'user' ? 'is-user' : 'is-bot'}`}>
              {m.text}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
