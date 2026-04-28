import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/ui/Logo'
import './Splash.css'

const SPLASH_MS = 1500

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/get-started', { replace: true }), SPLASH_MS)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="tt-splash">
      <div className="tt-splashInner">
        <Logo size={180} />
        <h1 className="tt-splashTitle">Built for teachers</h1>
        <p className="tt-splashSub">
          Plan lessons, take attendance, and run class—from one clear dashboard.
        </p>
      </div>
    </div>
  )
}
