import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import client from '../../api/client'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { setAuth, user } = useAuthStore()
  const initialMode: 'login' | 'register' =
    location.pathname === '/signup' || searchParams.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [form, setForm] = useState({ email: '', password: '', name: '', orgName: '' })

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  useEffect(() => {
    setMode(
      location.pathname === '/signup' || searchParams.get('mode') === 'register'
        ? 'register'
        : 'login',
    )
  }, [location.pathname, searchParams])

  const loginMutation = useMutation({
    mutationFn: () => client.post('/auth/login', { email: form.email, password: form.password }),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success('Welcome back ' + user.name)
      navigate('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Login failed'),
  })

  const registerMutation = useMutation({
    mutationFn: () => client.post('/auth/register', { email: form.email, password: form.password, name: form.name, orgName: form.orgName }),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success('Account created!')
      navigate('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Registration failed'),
  })

  const loading = loginMutation.isPending || registerMutation.isPending
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim().toLowerCase())

  const submit = () => {
    const email = form.email.trim().toLowerCase()
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (mode === 'register' && (!form.name.trim() || !form.orgName.trim())) {
      toast.error('Name and organization are required')
      return
    }

    if (!form.password || form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setForm((prev) => ({ ...prev, email }))
    mode === 'login' ? loginMutation.mutate() : registerMutation.mutate()
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '420px', background: '#333', border: '1px solid #444', borderTop: '3px solid #f3ad2c', borderRadius: '8px', padding: '40px' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#cc2229', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>AI PRICE OPTIMIZATION</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '700', color: '#f3ad2c' }}>PriceIQ</div>
          <div style={{ fontSize: '0.8rem', color: '#a0a0a0', marginTop: '4px' }}>{mode === 'login' ? 'Sign in to your workspace' : 'Create your workspace'}</div>
        </div>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', padding: '3px', marginBottom: '24px' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '3px', cursor: 'pointer', background: mode === m ? '#f3ad2c' : 'transparent', color: mode === m ? '#000' : '#a0a0a0', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#a0a0a0', textTransform: 'uppercase', marginBottom: '8px' }}>Your Name</label>
                <input style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', padding: '10px 14px', color: '#eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#a0a0a0', textTransform: 'uppercase', marginBottom: '8px' }}>Organization</label>
                <input style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', padding: '10px 14px', color: '#eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} placeholder="Acme Store" value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })} />
              </div>
            </>
          )}
          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#a0a0a0', textTransform: 'uppercase', marginBottom: '8px' }}>Email</label>
            <input style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', padding: '10px 14px', color: '#eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} autoComplete="email" />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', color: '#a0a0a0', textTransform: 'uppercase', marginBottom: '8px' }}>Password</label>
            <input style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', borderRadius: '5px', padding: '10px 14px', color: '#eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} type="password" placeholder="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
        </div>
        <button onClick={submit} disabled={loading} style={{ width: '100%', marginTop: '24px', padding: '13px', background: loading ? '#666' : '#f3ad2c', color: '#000', border: 'none', borderRadius: '5px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase' }}>
          {loading ? 'LOADING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', textDecoration: 'underline' }}>
            Continue without login
          </button>
        </div>
      </div>
    </div>
  )
}
