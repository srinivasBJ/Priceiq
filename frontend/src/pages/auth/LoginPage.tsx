import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import client from '../../api/client'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, token } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    email: '', password: '', name: '', orgName: ''
  })

  useEffect(() => {
    if (token) navigate('/')
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const loginMutation = useMutation({
    mutationFn: () => client.post('/auth/login', {
      email: form.email, password: form.password
    }),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success(`Welcome back, ${user.name}!`)
      navigate('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  })

  const registerMutation = useMutation({
    mutationFn: () => client.post('/auth/register', {
      email: form.email,
      password: form.password,
      name: form.name,
      orgName: form.orgName,
    }),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success('Account created!')
      navigate('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  })

  const handleSubmit = () => {
    if (mode === 'login') loginMutation.mutate()
    else registerMutation.mutate()
  }

  const loading = loginMutation.isPending || registerMutation.isPending

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: 0.3,
        animation: 'gridScroll 20s linear infinite',
      }} />

      {/* Glow blobs */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '15%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, #f3ad2c18, transparent 70%)',
        borderRadius: '50%',
        animation: 'float1 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%', right: '15%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, #cc222918, transparent 70%)',
        borderRadius: '50%',
        animation: 'float2 10s ease-in-out infinite',
      }} />

      <style>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 15px) scale(1.08); }
        }
        @keyframes inputFocus {
          from { box-shadow: none; }
          to { box-shadow: 0 0 0 2px #f3ad2c44; }
        }
      `}</style>

      {/* Card */}
      <div style={{
        width: '420px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--accent-yellow)',
        borderRadius: '8px',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.65rem',
            color: 'var(--accent-red)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>AI PRICE OPTIMIZATION</div>
          <div style={{
            fontFamily: 'var(--serif)',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--accent-yellow)',
          }}>PriceIQ</div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '4px',
          }}>
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your workspace'}
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
          borderRadius: '5px',
          padding: '3px',
          marginBottom: '24px',
        }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                background: mode === m ? 'var(--accent-yellow)' : 'transparent',
                color: mode === m ? '#000' : 'var(--text-muted)',
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Your Name</label>
                <input
                  className="form-control"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Organization Name</label>
                <input
                  className="form-control"
                  placeholder="Acme Store"
                  value={form.orgName}
                  onChange={e => setForm({ ...form, orgName: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '13px',
            background: loading ? '#666' : 'var(--accent-yellow)',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            fontFamily: 'var(--mono)',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            transform: 'translateY(0)',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = '#e09c1a'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px #f3ad2c44'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = loading ? '#666' : 'var(--accent-yellow)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading ? '...' : mode === 'login' ? '→ SIGN IN' : '→ CREATE ACCOUNT'}
        </button>

        {/* Footer */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: '0.62rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.5px',
        }}>
          PriceIQ v1.0 · AI-POWERED PRICING ENGINE
        </div>
      </div>
    </div>
  )
}