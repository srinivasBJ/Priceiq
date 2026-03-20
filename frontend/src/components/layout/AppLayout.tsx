import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getApiBaseUrl } from '../../lib/apiBaseUrl'

const navItems = [
  { section: 'MAIN' },
  { path: '/', label: 'Dashboard', icon: 'D' },
  { path: '/analytics', label: 'Analytics', icon: 'A' },
  { section: 'CATALOG' },
  { path: '/catalog', label: 'Browse Devices', icon: 'C' },
  { path: '/deals', label: 'Deals', icon: '$' },
  { path: '/compare', label: 'Compare', icon: '=' },
  { section: 'PRICING' },
  { path: '/wishlist', label: 'Wishlist', icon: 'W' },
  { path: '/tracker', label: 'Tracker', icon: 'T' },
  { section: 'SYSTEM' },
  { path: '/settings', label: 'Settings', icon: 'S' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [time, setTime] = useState(new Date())
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 980)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 980
      setIsMobile(mobile)
      if (!mobile) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate('/catalog/search?q=' + encodeURIComponent(search.trim()))
      setSearch('')
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <aside style={{ width: '240px', background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', position: 'fixed', height: '100vh', zIndex: 100, transform: isMobile ? (menuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)', transition: 'transform 0.2s ease' }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-red)', letterSpacing: '2px', textTransform: 'uppercase' }}>SYSTEM</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>PriceIQ</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>Price Intelligence Platform</div>
        </div>

        <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '7px', height: '7px', background: 'var(--green)', borderRadius: '50%' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--green)' }}>LIVE - ALL SYSTEMS OK</span>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} style={{ padding: '14px 20px 4px', fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--accent-yellow)', letterSpacing: '2px', fontWeight: '700', fontFamily: 'var(--mono)' }}>
                  {item.section}
                </div>
              )
            }
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.path === '/'}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  color: isActive ? '#000' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  borderLeft: isActive ? '3px solid var(--accent-yellow)' : '3px solid transparent',
                  background: isActive ? 'var(--accent-yellow)' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                })}
              >
                <span style={{ fontSize: '0.8rem', width: '18px', textAlign: 'center', fontFamily: 'var(--mono)' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-yellow)' }}>{user.role}</div>
              </div>
              <button onClick={() => logout()} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.6rem' }}>
                OUT
              </button>
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              Use top-right Login/Sign Up
            </div>
          )}
        </div>
      </aside>

      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 90 }}
        />
      )}

      <main style={{ marginLeft: isMobile ? '0' : '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ height: '58px', background: 'var(--sidebar-bg)', display: 'flex', alignItems: 'center', padding: isMobile ? '0 14px' : '0 24px', gap: '10px', borderBottom: '2px solid var(--accent-red)', position: 'sticky', top: 0, zIndex: 50 }}>
          {isMobile && (
            <button onClick={() => setMenuOpen((open) => !open)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', width: '34px', height: '34px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>
              ≡
            </button>
          )}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '560px', position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search phones, laptops... or paste a product link"
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 40px 8px 14px', color: 'var(--text-main)', fontFamily: 'var(--sans)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-yellow)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-yellow)', cursor: 'pointer', fontSize: '1rem' }}>
              *
            </button>
          </form>

          <div style={{ marginLeft: 'auto', display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {time.toLocaleTimeString()}
            </span>
            {user ? (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Hi, {user.name}
              </span>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  Login
                </button>
                <button onClick={() => navigate('/signup')} style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: isMobile ? '18px 14px' : '32px 40px', flex: 1 }}>
          <Outlet />
        </div>
      </main>

      <AIChatWidget />
    </div>
  )
}

function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Ask me about any phone or product pricing.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuthStore()
  const apiBaseUrl = getApiBaseUrl()

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            aiText += parsed.text
            setMessages(prev => {
              const u = [...prev]
              u[u.length - 1] = { role: 'assistant', content: aiText }
              return u
            })
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'AI needs a valid API key. Add it in Settings.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', width: '340px', height: '460px', background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent-yellow)', borderRadius: '12px', display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-yellow)', letterSpacing: '1px' }}>PRICEIQ AI</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>Powered by Claude</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>
              x
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', padding: '8px 12px', borderRadius: '10px', fontSize: '0.82rem', lineHeight: 1.5, background: m.role === 'user' ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.05)', color: m.role === 'user' ? '#000' : 'var(--text-main)', border: m.role === 'assistant' ? '1px solid var(--border)' : 'none' }}>
                  {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px', color: 'var(--text-main)', fontFamily: 'var(--sans)', fontSize: '0.82rem', outline: 'none' }}
            />
            <button onClick={send} disabled={loading} style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: '700' }}>
              -&gt;
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '52px', height: '52px', background: open ? 'var(--accent-red)' : 'var(--accent-yellow)', border: 'none', borderRadius: '50%', cursor: 'pointer', zIndex: 1000, fontSize: '0.7rem', fontFamily: 'var(--mono)', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
      >
        {open ? 'X' : 'AI'}
      </button>
    </>
  )
}
