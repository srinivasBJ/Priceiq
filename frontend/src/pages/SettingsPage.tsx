import { useAuthStore } from '../store/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>SYSTEM</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Settings</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Manage your account and organization</p>
      </div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">⊞ Account Info</span></div>
        <div className="panel-body">
          {[
            { label: 'Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role },
            { label: 'Organization ID', value: user?.organizationId },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{f.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--text-main)' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}