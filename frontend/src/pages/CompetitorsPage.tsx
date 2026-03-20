import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function CompetitorsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['competitors'],
    queryFn: () => client.get('/competitors').then(r => r.data.data),
  })

  const syncMutation = useMutation({
    mutationFn: () => client.post('/competitors/sync'),
    onSuccess: (res) => {
      toast.success(`Synced ${res.data.data.synced} competitors!`)
      qc.invalidateQueries({ queryKey: ['competitors'] })
    },
  })

  const competitors = data || []

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>PRICING</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Competitors</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Monitor competitor prices in real-time</p>
        </div>
        <button onClick={() => syncMutation.mutate()} className="btn btn-primary" disabled={syncMutation.isPending}>
          {syncMutation.isPending ? 'SYNCING...' : '⟳ SYNC NOW'}
        </button>
      </div>
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">◎ Competitor Data</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{competitors.length} tracked</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>LOADING...</div>
          ) : competitors.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>No competitors tracked</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Product</th><th>Competitor</th><th>Their Price</th><th>Last Scraped</th></tr></thead>
              <tbody>
                {competitors.map((c: any) => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-main)' }}>{c.product?.name}</td>
                    <td style={{ fontFamily: 'var(--mono)' }}>{c.competitorName}</td>
                    <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent-yellow)' }}>${c.price}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.lastScrapedAt ? new Date(c.lastScrapedAt).toLocaleString() : 'Never'}
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