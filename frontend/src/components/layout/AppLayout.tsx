import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'

const navItems = [
  { section: 'MONITOR' },
  { path: '/', label: 'Dashboard', icon: '◈' },
  { path: '/analytics', label: 'Analytics', icon: '▲' },
  { section: 'PRICING' },
  { path: '/products', label: 'Products', icon: '⬡' },
  { path: '/rules', label: 'Rules Engine', icon: '⚙' },
  { path: '/competitors', label: 'Competitors', icon: '◎' },
  { section: 'INTELLIGENCE' },
  { path: '/ai', label: 'AI Assistant', icon: '✦' },
  { path: '/alerts', label: 'Alerts', icon: '⚠' },
  { section: 'SYSTEM' },
  { path: '/settings', label: 'Settings', icon: '⊞' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: '260px',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{ padding: '30px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{
            display: 'block',
            fontSize: '0.7rem',
            color: 'var(--accent-red)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontFamily: 'var(--mono)',
          }}>SYSTEM</span>
          <span style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: 'var(--text-main)',
          }}>PriceIQ</span>
        </div>

        {/* Status */}
        <div style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            width: '8px', height: '8px',
            background: 'var(--green)',
            borderRadius: '50%',
            boxShadow: '0 0 8px var(--green)',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.7rem',
            color: 'var(--green)',
            letterSpacing: '0.5px',
          }}>ALL SYSTEMS NOMINAL</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} style={{
                  padding: '15px 20px 5px',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-yellow)',
                  letterSpacing: '1.5px',
                  fontWeight: '700',
                  fontFamily: 'var(--mono)',
                }}>{item.section}</div>
              )
            }
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.path === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: isActive ? '#000' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'var(--transition)',
                  borderLeft: isActive ? '3px solid transparent' : '3px solid transparent',
                  background: isActive ? 'var(--accent-yellow)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  if (!el.style.background.includes('yellow')) {
                    el.style.background = 'var(--nav-hover)'
                    el.style.color = 'var(--text-main)'
                    el.style.borderLeftColor = 'var(--accent-yellow)'
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  if (!el.style.background.includes('yellow')) {
                    el.style.background = 'transparent'
                    el.style.color = 'var(--text-muted)'
                    el.style.borderLeftColor = 'transparent'
                  }
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '1.1rem' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '15px 20px',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}>
          <div>{user?.name || 'User'}</div>
          <div style={{ color: 'var(--accent-yellow)', marginTop: '2px' }}>{user?.role}</div>
          <button onClick={handleLogout} style={{
            marginTop: '10px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            padding: '4px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{
          height: '60px',
          background: 'var(--sidebar-bg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 30px',
          borderBottom: '2px solid var(--accent-red)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <span style={{
            fontFamily: 'var(--mono)',
            color: 'var(--accent-yellow)',
            fontSize: '0.9rem',
          }}>PRICE OPTIMIZATION PLATFORM</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}>
              {time.toUTCString().slice(0, 25)} UTC
            </span>
            <span style={{
              background: 'var(--accent-yellow)',
              color: '#000',
              padding: '5px 12px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              fontFamily: 'var(--mono)',
              letterSpacing: '0.5px',
            }}>v1.0.0</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '40px', maxWidth: '1200px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}