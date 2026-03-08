import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { catalogDevices, trackerRange } from '../lib/deviceCatalog'

type TrackerDevice = (typeof catalogDevices)[number]

function makeHistory(current: number, low: number, high: number) {
  return Array.from({ length: 14 }, (_, idx) => {
    const range = high - low
    const wave = Math.sin((idx / 14) * Math.PI * 2) * (range * 0.14)
    const random = (Math.random() - 0.5) * (range * 0.1)
    const price = Math.round(Math.min(high, Math.max(low, current + wave + random)))
    return { day: 'D' + (idx + 1), price }
  })
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '0.7rem' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
      <div style={{ color: 'var(--accent-yellow)' }}>₹{payload[0].value.toLocaleString('en-IN')}</div>
    </div>
  )
}

export default function PriceTrackerPage() {
  const navigate = useNavigate()
  const [trackedNames, setTrackedNames] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('piq_tracked') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    const sync = () => {
      try {
        setTrackedNames(JSON.parse(localStorage.getItem('piq_tracked') || '[]'))
      } catch {
        return
      }
    }
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  const trackedDevices = useMemo(() => catalogDevices.filter((device) => trackedNames.includes(device.name)), [trackedNames])
  const [selected, setSelected] = useState<TrackerDevice | null>(null)

  useEffect(() => {
    if (trackedDevices.length > 0 && (!selected || !trackedDevices.find((device) => device.name === selected.name))) {
      setSelected(trackedDevices[0])
    }
    if (trackedDevices.length === 0) {
      setSelected(null)
    }
  }, [trackedDevices, selected])

  const removeTrack = (name: string) => {
    const next = trackedNames.filter((item) => item !== name)
    setTrackedNames(next)
    localStorage.setItem('piq_tracked', JSON.stringify(next))
  }

  if (trackedDevices.length === 0) {
    return (
      <div style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '28px', paddingBottom: '18px', borderBottom: '2px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>TOOLS</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '800', color: 'var(--accent-yellow)', margin: 0 }}>Price Tracker</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>↗</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '10px' }}>No devices tracked yet</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Go to Search Devices and tap ↗ on any device to track its price history</div>
          <button onClick={() => navigate('/catalog/search')} style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '11px 26px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: '700' }}>SEARCH DEVICES</button>
        </div>
      </div>
    )
  }

  const range = selected ? trackerRange(selected) : { low: 0, high: 0 }
  const history = selected ? makeHistory(selected.priceIN, range.low, range.high) : []
  const dropFromMrp = selected ? Math.round(((selected.mrpIN - selected.priceIN) / selected.mrpIN) * 100) : 0

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px', paddingBottom: '18px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>TOOLS</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '800', color: 'var(--accent-yellow)', margin: '0 0 4px' }}>Price Tracker</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>14-day price history · Highs, lows · Best time to buy</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>TRACKING {trackedDevices.length} DEVICES</div>
          {trackedDevices.map((device) => {
            const isActive = selected?.name === device.name
            const pct = Math.round(((device.mrpIN - device.priceIN) / device.mrpIN) * 100)
            return (
              <div key={device.name} style={{ position: 'relative' }}>
                <div
                  onClick={() => setSelected(device)}
                  style={{ background: isActive ? 'rgba(243,173,44,0.08)' : 'var(--sidebar-bg)', border: `1px solid ${isActive ? 'var(--accent-yellow)' : 'var(--border)'}`, borderRadius: '8px', padding: '12px 36px 12px 14px', cursor: 'pointer' }}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{device.brand.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px', lineHeight: 1.2 }}>{device.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-yellow)' }}>₹{device.priceIN.toLocaleString('en-IN')}</div>
                    {pct > 0 && <span style={{ background: '#4caf5020', color: '#4caf50', padding: '2px 6px', borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '0.56rem', fontWeight: '700' }}>-{pct}%</span>}
                  </div>
                </div>
                <button onClick={() => removeTrack(device.name)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px' }}>✕</button>
              </div>
            )
          })}
        </div>

        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '10px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{selected.brand.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>{selected.name}</div>
                </div>
                <button onClick={() => window.open(selected.amazonIN, '_blank', 'noopener,noreferrer')} style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '9px 16px', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.68rem', fontWeight: '700' }}>BUY ON AMAZON ↗</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { label: 'CURRENT', value: '₹' + selected.priceIN.toLocaleString('en-IN'), color: 'var(--accent-yellow)' },
                  { label: '14D LOW', value: '₹' + range.low.toLocaleString('en-IN'), color: '#4caf50' },
                  { label: '14D HIGH', value: '₹' + range.high.toLocaleString('en-IN'), color: 'var(--accent-red)' },
                  { label: 'OFF MRP', value: dropFromMrp + '%', color: '#5b9bd5' },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>PRICE HISTORY — LAST 14 DAYS</div>
              <ResponsiveContainer width='100%' height={190}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#333' vertical={false} />
                  <XAxis dataKey='day' tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#a0a0a0' }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 9, fill: '#a0a0a0' }} axisLine={false} tickLine={false} tickFormatter={(value) => (value / 1000).toFixed(0) + 'K'} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type='monotone' dataKey='price' stroke='#f3ad2c' strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'rgba(91,155,213,0.06)', border: '1px solid rgba(91,155,213,0.2)', borderRadius: '8px', padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: '#5b9bd5', background: 'rgba(91,155,213,0.15)', border: '1px solid rgba(91,155,213,0.3)', padding: '4px 8px', borderRadius: '4px', flexShrink: 0 }}>AI</div>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {dropFromMrp > 5 ? 'Good time to buy' : 'Wait for a better deal'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {dropFromMrp > 5
                    ? `Currently ${dropFromMrp}% below MRP and near its 14-day low of ₹${range.low.toLocaleString('en-IN')}.`
                    : `Price is near its 14-day high of ₹${range.high.toLocaleString('en-IN')}. Consider waiting for more discount.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
