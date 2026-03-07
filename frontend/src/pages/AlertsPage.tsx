import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function AlertsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => client.get('/alerts').then(r => r.data.data),
  })

  const resolveMutation = useMutation({
    mutationFn: (id: string) => client.patch(`/alerts/${id}/resolve`),
    onSuccess: () => {
      toast.success('Alert resolved!')
      qc.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  const alerts = data || []

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>INTELLIGENCE</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Alerts</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Price anomalies and system notifications</p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">⚠ Active Alerts</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {alerts.filter((a: any) => !a.isResolved).length} unresolved
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>LOADING...</div>
          ) : alerts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--green)', marginBottom: '8px' }}>✓ All Clear</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No active alerts</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Type</th><th>Message</th><th>Time</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {alerts.map((a: any) => (
                  <tr key={a.id}>
                    <td><span className="badge badge-red">{a.type}</span></td>
                    <td style={{ color: 'var(--text-main)' }}>{a.message}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${a.isResolved ? 'badge-green' : 'badge-red'}`}>{a.isResolved ? 'RESOLVED' : 'OPEN'}</span></td>
                    <td>
                      {!a.isResolved && (
                        <button onClick={() => resolveMutation.mutate(a.id)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                          RESOLVE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}