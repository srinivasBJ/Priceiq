import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogDevices, formatInr, formatUsd } from '../lib/deviceCatalog'

const suggestions = ['iPhone 16 Pro Max', 'Samsung Galaxy S26 Ultra', 'OnePlus 13', 'MacBook Air M4 13-inch']

const scoreColor = (score: number) => (score >= 90 ? '#4caf50' : score >= 80 ? '#f3ad2c' : '#5b9bd5')

const normalizeQuery = (value: string) =>
  value
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[/?=&_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const stopWords = new Set(['amazon', 'www', 'com', 'in', 'dp', 'gp', 'product', 'store', 's', 'k', 'ref'])

const findBestCatalogMatch = (rawQuery: string) => {
  const normalized = normalizeQuery(rawQuery)
  if (!normalized) return null

  const exact = catalogDevices.find((device) => device.name.toLowerCase() === normalized)
  if (exact) return { device: exact, confidence: 'exact' as const }

  const direct = catalogDevices.find(
    (device) =>
      normalized.includes(device.name.toLowerCase()) || device.name.toLowerCase().includes(normalized),
  )
  if (direct) return { device: direct, confidence: 'strong' as const }

  const queryTokens = normalized
    .split(' ')
    .filter((token) => token.length > 2 && !stopWords.has(token))

  if (!queryTokens.length) return null

  let best: { device: (typeof catalogDevices)[number]; score: number } | null = null
  for (const device of catalogDevices) {
    const haystack = `${device.name} ${device.brand} ${device.category}`.toLowerCase()
    const matched = queryTokens.filter((token) => haystack.includes(token)).length
    if (!best || matched > best.score) {
      best = { device, score: matched }
    }
  }

  if (!best || best.score === 0) return null
  if (best.score >= 2) return { device: best.device, confidence: 'fuzzy' as const }
  if (normalized.includes('amazon')) return { device: best.device, confidence: 'closest' as const }
  return null
}

export default function ComparePage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const result = useMemo(() => {
    if (!query) return null
    const best = findBestCatalogMatch(query)
    return best
  }, [query])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next = input.trim()
    if (!next) return
    setQuery(next)
    setError('')
    if (!catalogDevices.length) {
      setError('Catalog is not available right now.')
    }
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px', paddingBottom: '18px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>PRICE INTELLIGENCE</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: '800', color: 'var(--accent-yellow)', margin: '0 0 4px' }}>Price Comparison</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Search any device or paste an Amazon link to compare pricing quickly</p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(243,173,44,0.07), rgba(204,34,41,0.04))', border: '1px solid var(--border)', borderRadius: '10px', padding: '28px', marginBottom: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>SEARCH DEVICE OR PASTE AMAZON LINK</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='e.g. iPhone 16 Pro Max or amazon.in/s?k=OnePlus+13'
              style={{ flex: 1, minWidth: '260px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: '8px', padding: '13px 18px', color: 'var(--text-main)', fontFamily: 'var(--sans)', fontSize: '0.92rem', outline: 'none' }}
            />
            <button type='submit' style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '13px 24px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
              COMPARE
            </button>
          </div>
        </form>
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>TRY:</span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion)
                setQuery(suggestion)
                setError('')
              }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.6rem' }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {!result && query && !error && (
        <div style={{ background: 'rgba(204,34,41,0.08)', border: '1px solid rgba(204,34,41,0.3)', borderRadius: '8px', padding: '16px 20px', fontFamily: 'var(--sans)', fontSize: '0.85rem', color: '#cc2229' }}>
          Product not found in catalog yet. Try: {suggestions.join(', ')}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(204,34,41,0.08)', border: '1px solid rgba(204,34,41,0.3)', borderRadius: '8px', padding: '16px 20px', fontFamily: 'var(--sans)', fontSize: '0.85rem', color: '#cc2229' }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '22px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>{result.device.brand} · {result.device.category} · {result.device.year}</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 12px' }}>{result.device.name}</h2>
                {result.confidence !== 'exact' && (
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--accent-yellow)', marginBottom: '8px' }}>
                    Showing closest catalog match for the pasted input.
                  </div>
                )}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {result.device.specs.slice(0, 5).map(([label, value]) => (
                    <div key={label} style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem' }}>
                      <span style={{ color: 'var(--accent-red)' }}>{label}: </span>
                      <span style={{ color: 'var(--text-muted)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>AI SCORE</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '2.4rem', fontWeight: '800', color: scoreColor(result.device.score), lineHeight: 1 }}>{result.device.score}</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '18px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              PRICE COMPARISON — ALL STORES
            </div>
            {[
              { store: 'Amazon India', price: formatInr(result.device.priceIN), mrp: formatInr(result.device.mrpIN), color: '#4caf50', url: result.device.amazonIN, badge: 'LOWEST IN' },
              { store: 'Amazon USA', price: formatUsd(result.device.priceUS), mrp: formatUsd(result.device.mrpUS), color: '#5b9bd5', url: result.device.amazonUS, badge: 'LOWEST US' },
              { store: 'Official India MRP', price: formatInr(result.device.mrpIN), mrp: formatInr(result.device.mrpIN), color: 'var(--text-muted)', url: '', badge: 'MRP' },
              { store: 'Official USA MRP', price: formatUsd(result.device.mrpUS), mrp: formatUsd(result.device.mrpUS), color: 'var(--text-muted)', url: '', badge: 'MRP' },
            ].map((entry, idx) => (
              <div
                key={entry.store}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: idx < 3 ? '1px solid var(--border)' : 'none', background: entry.badge.startsWith('LOWEST') ? 'rgba(76,175,80,0.05)' : 'transparent', cursor: entry.url ? 'pointer' : 'default' }}
                onClick={() => entry.url && window.open(entry.url, '_blank', 'noopener,noreferrer')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-main)' }}>{entry.store}</span>
                  <span style={{ background: `${entry.color}22`, border: `1px solid ${entry.color}44`, color: entry.color, padding: '2px 7px', borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '0.52rem', fontWeight: '700' }}>{entry.badge}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '1rem', fontWeight: '700', color: entry.color }}>{entry.price}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(243,173,44,0.07)', border: '1px solid rgba(243,173,44,0.25)', borderRadius: '8px', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '5px' }}>PRICE VERDICT</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              Amazon India is {formatInr(result.device.mrpIN - result.device.priceIN)} below India MRP, and Amazon USA is {formatUsd(result.device.mrpUS - result.device.priceUS)} below USA MRP.
              </div>
            </div>

          <button onClick={() => navigate('/catalog/search?q=' + encodeURIComponent(result.device.name))} style={{ marginTop: '14px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
            VIEW FULL SPECS →
          </button>
        </div>
      )}
    </div>
  )
}
