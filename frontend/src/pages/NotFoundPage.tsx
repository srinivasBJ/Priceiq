import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'var(--bg-dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--accent-red)', letterSpacing: '3px' }}>ERROR 404</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: '3rem', color: 'var(--accent-yellow)' }}>Page Not Found</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The page you're looking for doesn't exist.</div>
      <button onClick={() => navigate('/')} style={{
        marginTop: '16px', background: 'var(--accent-yellow)', color: '#000',
        border: 'none', padding: '10px 24px', borderRadius: '4px',
        fontFamily: 'var(--mono)', fontWeight: '700', cursor: 'pointer',
        fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase',
      }}>← BACK TO DASHBOARD</button>
    </div>
  )
}