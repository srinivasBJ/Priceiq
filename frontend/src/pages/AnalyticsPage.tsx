import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  revenue: Math.floor(10000 + Math.random() * 10000),
  margin: Math.floor(25 + Math.random() * 20),
}))

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => client.get('/analytics/dashboard').then(r => r.data.data),
  })

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>MONITOR</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Analytics</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Revenue, margin, and performance trends</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px', marginBottom: '24px' }}>
        {[
          { label: 'Total Products', value: data?.totalProducts || 0, color: 'var(--accent-yellow)' },
          { label: 'Avg Margin', value: `${data?.avgMargin || 0}%`, color: 'var(--green)' },
          { label: 'Unresolved Alerts', value: data?.unresolvedAlerts || 0, color: 'var(--accent-red)' },
        ].map((s, i) => (
          <div key={i} className="panel" style={{ margin: 0 }}>
            <div className="panel-body" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', color: s.color, fontWeight: '700' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header"><span className="panel-title">▲ Revenue Trend — 30 Days</span></div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f3ad2c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f3ad2c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#f3ad2c" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}