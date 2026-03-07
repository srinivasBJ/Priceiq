import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function RulesPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: () => client.get('/rules').then(r => r.data.data),
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => client.post(`/rules/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  })

  const rules = data || []

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>PRICING</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Rules Engine</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Automated pricing rules with priority order</p>
      </div>
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">⚙ Active Rules</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{rules.length} rules</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>LOADING...</div>
          ) : rules.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>No rules yet</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Create your first pricing rule to automate decisions</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {rules.map((r: any) => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-main)', fontWeight: '500' }}>{r.name}</td>
                    <td style={{ fontFamily: 'var(--mono)' }}>{r.priority}</td>
                    <td><span className={`badge ${r.isActive ? 'badge-green' : 'badge-gray'}`}>{r.isActive ? 'ACTIVE' : 'PAUSED'}</span></td>
                    <td>
                      <button onClick={() => toggleMutation.mutate(r.id)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                        {r.isActive ? 'PAUSE' : 'ACTIVATE'}
                      </button>
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