import { FormEvent, MouseEvent, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CatalogDevice, catalogDevices, formatInr, formatUsd } from '../lib/deviceCatalog'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = (searchParams.get('q') || '').trim()

  const [search, setSearch] = useState(query)
  const [selected, setSelected] = useState<CatalogDevice | null>(null)
  const [sortBy, setSortBy] = useState<'relevance' | 'score' | 'price_low' | 'price_high'>('relevance')
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('piq_wishlist') || '[]')
    } catch {
      return []
    }
  })
  const [tracked, setTracked] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('piq_tracked') || '[]')
    } catch {
      return []
    }
  })

  const filtered = useMemo(() => {
    if (!query) return catalogDevices
    const q = query.toLowerCase()
    return catalogDevices.filter(
      (device) =>
        device.name.toLowerCase().includes(q) ||
        device.brand.toLowerCase().includes(q) ||
        device.category.toLowerCase().includes(q),
    )
  }, [query])

  const sorted = useMemo(() => {
    const list = [...(filtered.length ? filtered : catalogDevices)]
    if (sortBy === 'score') return list.sort((a, b) => b.score - a.score)
    if (sortBy === 'price_low') return list.sort((a, b) => a.priceIN - b.priceIN)
    if (sortBy === 'price_high') return list.sort((a, b) => b.priceIN - a.priceIN)
    return list
  }, [filtered, sortBy])

  const toggleWishlist = (name: string, e: MouseEvent) => {
    e.stopPropagation()
    const next = wishlist.includes(name) ? wishlist.filter((x) => x !== name) : [...wishlist, name]
    setWishlist(next)
    localStorage.setItem('piq_wishlist', JSON.stringify(next))
  }

  const toggleTrack = (name: string, e: MouseEvent) => {
    e.stopPropagation()
    const next = tracked.includes(name) ? tracked.filter((x) => x !== name) : [...tracked, name]
    setTracked(next)
    localStorage.setItem('piq_tracked', JSON.stringify(next))
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate('/catalog/search?q=' + encodeURIComponent(search.trim()))
  }

  const scoreColor = (score: number) => (score >= 90 ? '#4caf50' : score >= 80 ? '#f3ad2c' : '#5b9bd5')

  if (selected) {
    return (
      <div style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setSelected(null)}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', textTransform: 'uppercase' }}
          >
            BACK
          </button>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            {selected.brand} / {selected.category} / {selected.name}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '28px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
              {selected.brand} · {selected.category} · {selected.year}
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>{selected.name}</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${scoreColor(selected.score)}22`, border: `1px solid ${scoreColor(selected.score)}44`, padding: '4px 10px', borderRadius: '4px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: scoreColor(selected.score) }}>AI SCORE</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: '800', color: scoreColor(selected.score) }}>{selected.score}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {selected.specs.map(([label, value], idx) => (
                  <tr key={label} style={{ background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent' }}>
                    <td style={{ padding: '11px 14px', fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: '700', width: '130px', borderBottom: '1px solid var(--border)' }}>{label}</td>
                    <td style={{ padding: '11px 14px', fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ position: 'sticky', top: '70px', alignSelf: 'start' }}>
            <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent-yellow)', borderRadius: '8px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-yellow)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>PRICES</div>
              {[
                { store: 'Amazon India', price: formatInr(selected.priceIN), sub: 'amazon.in', color: 'var(--accent-yellow)', url: selected.amazonIN },
                { store: 'Amazon USA', price: formatUsd(selected.priceUS), sub: 'amazon.com', color: '#5b9bd5', url: selected.amazonUS },
                { store: 'MRP India', price: formatInr(selected.mrpIN), sub: 'official retail', color: 'var(--text-muted)', url: '' },
                { store: 'MRP USA', price: formatUsd(selected.mrpUS), sub: 'official retail', color: 'var(--text-muted)', url: '' },
              ].map((row) => (
                <div
                  key={row.store}
                  onClick={() => row.url && window.open(row.url, '_blank', 'noopener,noreferrer')}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: row.url ? 'rgba(243,173,44,0.06)' : 'rgba(0,0,0,0.2)', borderRadius: '6px', border: `1px solid ${row.url ? 'rgba(243,173,44,0.2)' : 'var(--border)'}`, marginBottom: '8px', cursor: row.url ? 'pointer' : 'default' }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: row.url ? '700' : '400' }}>{row.store}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--text-muted)' }}>{row.sub}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', fontWeight: '700', color: row.color }}>{row.price}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>AI PRICE SCORE</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '3rem', fontWeight: '800', color: scoreColor(selected.score), lineHeight: 1 }}>{selected.score}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>DEVICE SEARCH</div>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search phones, laptops, tablets...'
              style={{ flex: 1, minWidth: '260px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 18px', color: 'var(--text-main)', fontFamily: 'var(--sans)', fontSize: '0.95rem', outline: 'none' }}
            />
            <button type='submit' style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>SEARCH</button>
            <button type='button' onClick={() => navigate('/wishlist')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 18px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', textTransform: 'uppercase' }}>WISHLIST</button>
            <button type='button' onClick={() => navigate('/tracker')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 18px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.7rem', textTransform: 'uppercase' }}>TRACKER</button>
          </div>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {sorted.length} devices{query ? ` for "${query}"` : ''}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              ['relevance', 'RELEVANCE'],
              ['score', 'AI SCORE'],
              ['price_low', 'PRICE LOW'],
              ['price_high', 'PRICE HIGH'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSortBy(value as typeof sortBy)}
                style={{ background: sortBy === value ? 'var(--accent-yellow)' : 'transparent', border: `1px solid ${sortBy === value ? 'var(--accent-yellow)' : 'var(--border)'}`, color: sortBy === value ? '#000' : 'var(--text-muted)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.58rem', fontWeight: sortBy === value ? '700' : '400' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {sorted.map((device) => (
          <div
            key={device.name}
            onClick={() => setSelected(device)}
            style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-yellow)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>{device.brand} · {device.category} · {device.year}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.3 }}>{device.name}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
                <div style={{ background: scoreColor(device.score), color: '#000', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--mono)', fontSize: '0.68rem', fontWeight: '700' }}>{device.score}</div>
                <button
                  onClick={(event) => toggleWishlist(device.name, event)}
                  title={wishlist.includes(device.name) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  style={{ background: wishlist.includes(device.name) ? 'rgba(243,173,44,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${wishlist.includes(device.name) ? 'var(--accent-yellow)' : 'var(--border)'}`, color: wishlist.includes(device.name) ? 'var(--accent-yellow)' : 'var(--text-muted)', width: '30px', height: '30px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  {wishlist.includes(device.name) ? '♥' : '♡'}
                </button>
                <button
                  onClick={(event) => toggleTrack(device.name, event)}
                  title={tracked.includes(device.name) ? 'Stop Tracking' : 'Track Price'}
                  style={{ background: tracked.includes(device.name) ? 'rgba(91,155,213,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${tracked.includes(device.name) ? '#5b9bd5' : 'var(--border)'}`, color: tracked.includes(device.name) ? '#5b9bd5' : 'var(--text-muted)', width: '30px', height: '30px', borderRadius: '5px', cursor: 'pointer' }}
                >
                  ↗
                </button>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 2 }}>
              {device.specs.slice(0, 4).map(([label, value]) => (
                <div key={label}>
                  <span style={{ color: 'var(--accent-red)' }}>{label}:</span> {value}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '5px', padding: '8px 10px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', color: 'var(--text-muted)', marginBottom: '2px' }}>AMAZON.IN</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-yellow)' }}>{formatInr(device.priceIN)}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '5px', padding: '8px 10px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.52rem', color: 'var(--text-muted)', marginBottom: '2px' }}>AMAZON.COM</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.82rem', fontWeight: '700', color: '#5b9bd5' }}>{formatUsd(device.priceUS)}</div>
              </div>
            </div>
            <div style={{ marginTop: '8px', fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-yellow)', textAlign: 'right' }}>VIEW SPECS →</div>
          </div>
        ))}
      </div>
    </div>
  )
}
