import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'

// ── Animated Counter ──────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    const start = ref.current
    const end = value
    const duration = 1200
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      const current = start + (end - start) * ease
      setDisplay(current)
      ref.current = current
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return (
    <span>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}

// ── Sparkline mini chart ──────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const min = Math.min(...data)
    const max = Math.max(...data)
    const y = 100 - ((v - min) / (max - min + 1)) * 80
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="80" height="32" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, prefix, suffix, decimals, sub, accent, spark, delay }: {
  label: string; value: number; prefix?: string; suffix?: string
  decimals?: number; sub: string; accent: string; spark: number[]; delay: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${hovered ? accent : 'var(--border)'}`,
        borderRadius: '8px',
        padding: '22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        cursor: 'default',
        boxShadow: hovered ? `0 0 24px ${accent}22` : 'none',
      }}
    >
      {/* bottom accent bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
        background: accent,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0.3)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease',
      }} />

      {/* Glow bg on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(circle at top left, ${accent}08, transparent 60%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.62rem',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>{label}</div>
          <div style={{
            fontFamily: 'var(--serif)',
            fontSize: '2.4rem',
            fontWeight: '700',
            color: accent,
            lineHeight: 1,
            transition: 'transform 0.2s',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}>
            {visible && <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>
        </div>
        <div style={{ opacity: 0.7 }}>
          <Sparkline data={spark} color={accent} />
        </div>
      </div>
    </div>
  )
}

// ── Activity Log Item ─────────────────────────────────────────────
function LogItem({ text, time, type, index }: {
  text: string; time: string; type: 'success' | 'warning' | 'info'; index: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80 + 400)
    return () => clearTimeout(t)
  }, [index])

  const colors = { success: 'var(--green)', warning: 'var(--accent-yellow)', info: 'var(--blue)' }
  const icons = { success: '✓', warning: '⚠', info: '→' }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
      transform: visible ? 'translateX(0)' : 'translateX(-12px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      animation: visible ? 'slideIn 0.3s ease' : 'none',
    }}>
      <div style={{
        width: '22px', height: '22px',
        borderRadius: '50%',
        background: `${colors[type]}22`,
        border: `1px solid ${colors[type]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.6rem',
        color: colors[type],
        flexShrink: 0,
        fontWeight: 'bold',
      }}>{icons[type]}</div>
      <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{text}</span>
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        opacity: 0.6,
        flexShrink: 0,
      }}>{time}</span>
    </div>
  )
}

// ── Optimization Score Ring ────────────────────────────────────────
function OptimizationRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0)
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (animated / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0
      const step = () => {
        s += 1.2
        if (s <= score) { setAnimated(Math.min(s, score)); requestAnimationFrame(step) }
      }
      requestAnimationFrame(step)
    }, 600)
    return () => clearTimeout(t)
  }, [score])

  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--accent-yellow)' : 'var(--accent-red)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: 'stroke-dasharray 0.05s linear',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.8rem',
            fontWeight: '700',
            color,
            lineHeight: 1,
          }}>{Math.round(animated)}</div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '1px',
            marginTop: '2px',
          }}>SCORE</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '180px' }}>
          Your pricing is optimized across {Math.round(score * 0.4)} of your products
        </div>
        <div style={{
          marginTop: '12px',
          display: 'inline-block',
          background: `${color}22`,
          border: `1px solid ${color}44`,
          color,
          padding: '4px 10px',
          borderRadius: '3px',
          fontFamily: 'var(--mono)',
          fontSize: '0.62rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          {score >= 80 ? 'OPTIMIZED' : score >= 60 ? 'IN PROGRESS' : 'ACTION NEEDED'}
        </div>
      </div>
    </div>
  )
}

// ── Custom Tooltip ─────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      padding: '10px 14px',
      fontFamily: 'var(--mono)',
      fontSize: '0.75rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  )
}

// ── Mock data generators ──────────────────────────────────────────
const generateRevenueData = () =>
  Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    revenue: Math.floor(12000 + Math.random() * 8000),
    margin: Math.floor(28 + Math.random() * 18),
  }))

const generateProductData = () =>
  ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'].map(name => ({
    name,
    current: Math.floor(20 + Math.random() * 80),
    optimal: Math.floor(30 + Math.random() * 70),
  }))

const mockActivity = [
  { text: 'AI optimizer raised price on SKU-1042 by 12%', time: '2m ago', type: 'success' as const },
  { text: 'Competitor Amazon undercut SKU-2201 by $3.40', time: '8m ago', type: 'warning' as const },
  { text: 'Rule "Weekend Markup" triggered for 14 products', time: '15m ago', type: 'info' as const },
  { text: 'Price elasticity model retrained on new data', time: '1h ago', type: 'success' as const },
  { text: 'Alert: 3 products below minimum margin threshold', time: '2h ago', type: 'warning' as const },
  { text: 'Shopify sync completed — 48 prices updated', time: '3h ago', type: 'success' as const },
]

// ── MAIN DASHBOARD ────────────────────────────────────────────────
export default function DashboardPage() {
  const [revenueData] = useState(generateRevenueData)
  const [productData] = useState(generateProductData)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const { data: dashData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => client.get('/analytics/dashboard').then(r => r.data.data),
  })

  const stats = [
    {
      label: 'Total Products',
      value: dashData?.totalProducts || 148,
      suffix: '',
      sub: '+12 this week',
      accent: 'var(--accent-yellow)',
      spark: [40, 55, 48, 62, 70, 65, 80, 75, 90, 85, 95, 88],
      delay: 100,
    },
    {
      label: 'Revenue Today',
      value: dashData?.totalRevenue || 48240,
      prefix: '$',
      decimals: 0,
      sub: '↑ 8.4% vs yesterday',
      accent: 'var(--green)',
      spark: [30, 45, 38, 55, 60, 52, 70, 65, 80, 72, 88, 82],
      delay: 200,
    },
    {
      label: 'Avg Margin',
      value: dashData?.avgMargin || 34.2,
      suffix: '%',
      decimals: 1,
      sub: '↑ 2.1% this month',
      accent: 'var(--blue)',
      spark: [25, 28, 26, 30, 32, 29, 35, 33, 36, 34, 38, 36],
      delay: 300,
    },
    {
      label: 'Alerts',
      value: dashData?.unresolvedAlerts || 3,
      sub: '2 critical, 1 warning',
      accent: 'var(--accent-red)',
      spark: [5, 3, 7, 4, 6, 8, 5, 9, 6, 4, 7, 3],
      delay: 400,
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '2px solid var(--border)',
        transform: headerVisible ? 'translateY(0)' : 'translateY(-16px)',
        opacity: headerVisible ? 1 : 0,
        transition: 'all 0.5s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--accent-red)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>MISSION CONTROL</div>
            <h1 style={{
              fontFamily: 'var(--serif)',
              fontSize: '1.9rem',
              fontWeight: '700',
              color: 'var(--accent-yellow)',
              marginBottom: '6px',
            }}>Dashboard</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Real-time pricing intelligence & optimization overview
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--accent-yellow)',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#e09c1a'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--accent-yellow)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >⟳ REFRESH</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '18px',
        marginBottom: '32px',
      }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} decimals={s.decimals || 0} />
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginBottom: '22px' }}>

        {/* Revenue Chart */}
        <div className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-header">
            <span className="panel-title">⬡ Revenue & Margin Trend — Last 14 Days</span>
            <span style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
            }}>LIVE · updates every 60s</span>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f3ad2c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f3ad2c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="margGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b9bd5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5b9bd5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rev" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="mar" orientation="right" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#f3ad2c" strokeWidth={2} fill="url(#revGrad)" name="Revenue $" dot={false} />
                <Area yAxisId="mar" type="monotone" dataKey="margin" stroke="#5b9bd5" strokeWidth={2} fill="url(#margGrad)" name="Margin %" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Optimization Score */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">◎ Optimization Score</span>
          </div>
          <div className="panel-body">
            <OptimizationRing score={dashData?.avgMargin ? Math.min(Math.round(dashData.avgMargin * 2.2), 100) : 78} />
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Rules Active', value: '12', color: 'var(--green)' },
                { label: 'Auto-Priced', value: '94%', color: 'var(--accent-yellow)' },
                { label: 'Competitor Data', value: 'FRESH', color: 'var(--blue)' },
                { label: 'Last Run', value: '4m ago', color: 'var(--text-muted)' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border)',
                  borderRadius: '5px',
                  padding: '10px 12px',
                }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: item.color, fontWeight: '600' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">▲ Activity Log</span>
            <span style={{
              width: '8px', height: '8px',
              background: 'var(--green)',
              borderRadius: '50%',
              display: 'inline-block',
              boxShadow: '0 0 6px var(--green)',
              animation: 'pulse 2s infinite',
            }} />
          </div>
          <div className="panel-body" style={{ padding: '10px 22px' }}>
            {mockActivity.map((item, i) => (
              <LogItem key={i} {...item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Product Price Comparison */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">⬡ Current vs Optimal Price — Top Products</span>
          <a href="/products" style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.65rem',
            color: 'var(--accent-yellow)',
            textDecoration: 'none',
            letterSpacing: '1px',
          }}>VIEW ALL →</a>
        </div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productData} barGap={4} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="name" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#a0a0a0' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" fill="#444" name="Current $" radius={[3, 3, 0, 0]} />
              <Bar dataKey="optimal" fill="#f3ad2c" name="Optimal $" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'flex-end' }}>
            {[{ color: '#444', label: 'Current Price' }, { color: '#f3ad2c', label: 'AI Optimal' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', background: l.color, borderRadius: '2px' }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Pulse */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">◎ Competitor Pulse</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            Last synced 4 min ago
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Your Price</th>
                <th>Amazon</th>
                <th>eBay</th>
                <th>Walmart</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Wireless Headphones', ours: '$89.99', amz: '$84.99', ebay: '$91.50', wmt: '$87.00', status: 'undercut', statusLabel: 'UNDERCUT' },
                { name: 'USB-C Hub 7-Port', ours: '$34.99', amz: '$38.50', ebay: '$36.00', wmt: '$39.99', status: 'winning', statusLabel: 'WINNING' },
                { name: 'Laptop Stand Pro', ours: '$49.99', amz: '$49.99', ebay: '$52.00', wmt: '$48.50', status: 'parity', statusLabel: 'PARITY' },
                { name: 'Mechanical Keyboard', ours: '$129.00', amz: '$119.00', ebay: '$124.99', wmt: '$122.00', status: 'undercut', statusLabel: 'UNDERCUT' },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-main)', fontWeight: '500' }}>{row.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent-yellow)' }}>{row.ours}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{row.amz}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{row.ebay}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{row.wmt}</td>
                  <td>
                    <span className={`badge ${row.status === 'undercut' ? 'badge-red' : row.status === 'winning' ? 'badge-green' : 'badge-yellow'}`}>
                      {row.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}