import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './AppShell.css'

export default function AppShell() {
  return (
    <div className="tt-appShell">
      <Sidebar />
      <main className="tt-appMain">
        <div className="tt-appContent">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
