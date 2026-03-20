import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { catalogDevices, monogramForDevice } from '../lib/deviceCatalog'

type Device = (typeof catalogDevices)[number]

const S = {
  row: {
    background: 'var(--sidebar-bg)',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  } as CSSProperties,
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    background: 'rgba(243,173,44,0.1)',
    border: '1px solid rgba(243,173,44,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--mono)',
    fontSize: '0.65rem',
    fontWeight: 800,
    color: 'var(--accent-yellow)',
    flexShrink: 0,
  } as CSSProperties,
  label: {
    fontFamily: 'var(--mono)',
    fontSize: '0.54rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '3px',
  } as CSSProperties,
  price: {
    fontFamily: 'var(--mono)',
    fontSize: '1.05rem',
    fontWeight: 800,
    color: 'var(--accent-yellow)',
  } as CSSProperties,
  input: {
    width: '85px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid var(--accent-yellow)',
    borderRadius: '4px',
    padding: '4px 7px',
    color: 'var(--text-main)',
    fontFamily: 'var(--mono)',
    fontSize: '0.72rem',
    outline: 'none',
  } as CSSProperties,
  btnOk: {
    background: 'var(--accent-yellow)',
    border: 'none',
    color: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'var(--mono)',
    fontSize: '0.65rem',
    fontWeight: 700,
  } as CSSProperties,
  btnBuy: {
    background: 'rgba(243,173,44,0.12)',
    border: '1px solid rgba(243,173,44,0.3)',
    color: 'var(--accent-yellow)',
    padding: '7px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'var(--mono)',
    fontSize: '0.62rem',
    fontWeight: 700,
  } as CSSProperties,
  btnRemove: {
    background: 'rgba(204,34,41,0.1)',
    border: '1px solid rgba(204,34,41,0.3)',
    color: 'var(--accent-red)',
    padding: '7px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  } as CSSProperties,
}

export default function WishlistPage() {
  const navigate = useNavigate()

  const [names, setNames] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('piq_wishlist') || '[]')
    } catch {
      return []
    }
  })

  const [targets, setTargets] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('piq_targets') || '{}')
    } catch {
      return {}
    }
  })

  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [tempTarget, setTempTarget] = useState('')

  useEffect(() => {
    const sync = () => {
      try {
        setNames(JSON.parse(localStorage.getItem('piq_wishlist') || '[]'))
      } catch {
        return
      }
    }
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  const items: Device[] = catalogDevices.filter((device) => names.includes(device.name))

  const remove = (name: string) => {
    const next = names.filter((n) => n !== name)
    setNames(next)
    localStorage.setItem('piq_wishlist', JSON.stringify(next))
  }

  const saveTarget = (name: string) => {
    const val = parseInt(tempTarget.replace(/[^0-9]/g, ''), 10)
    if (!Number.isNaN(val) && val > 0) {
      const next = { ...targets, [name]: val }
      setTargets(next)
      localStorage.setItem('piq_targets', JSON.stringify(next))
    }
    setEditTarget(null)
  }

  const below = items.filter((item) => item.priceIN <= (targets[item.name] ?? Math.round(item.priceIN * 0.9))).length
  const avgLeft =
    items.length === 0
      ? 0
      : Math.round(
          items.reduce((acc, item) => {
            const target = targets[item.name] ?? Math.round(item.priceIN * 0.9)
            return acc + Math.max(0, ((item.priceIN - target) / item.priceIN) * 100)
          }, 0) / items.length,
        )

  return (
    <div style={{ maxWidth: '920px' }}>
      <div style={{ marginBottom: '28px', paddingBottom: '18px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.62rem', color: 'var(--accent-red)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>TOOLS</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-yellow)', margin: '0 0 4px' }}>Wishlist</h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          {items.length === 0 ? 'Tap the heart on any device in Search to save it here' : 'Save devices · Set target prices · Get drop alerts'}
        </p>
      </div>

      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 20px' }}>
            <div style={S.label}>SAVED DEVICES</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>{items.length}</div>
          </div>
          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 20px' }}>
            <div style={S.label}>BELOW TARGET</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1.8rem', fontWeight: 800, color: '#4caf50' }}>{below}</div>
          </div>
          <div style={{ background: 'var(--sidebar-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 20px' }}>
            <div style={S.label}>AVG SAVINGS LEFT</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1.8rem', fontWeight: 800, color: '#5b9bd5' }}>{avgLeft + '%'}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => {
          const target = targets[item.name]
          const pctOff = Math.round(((item.mrpIN - item.priceIN) / item.mrpIN) * 100)
          const hitTarget = !!(target && item.priceIN <= target)
          const diff = target ? item.priceIN - target : null

          return (
            <div key={item.name} style={{ ...S.row, border: '1px solid ' + (hitTarget ? 'rgba(76,175,80,0.4)' : 'var(--border)') }}>
              <div style={S.avatar}>{monogramForDevice(item.name)}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</span>
                  {hitTarget && (
                    <span style={{ background: '#4caf5020', border: '1px solid #4caf5040', color: '#4caf50', padding: '2px 7px', borderRadius: '4px', fontFamily: 'var(--mono)', fontSize: '0.56rem', fontWeight: 700 }}>
                      TARGET HIT
                    </span>
                  )}
                  {pctOff > 0 && (
                    <span style={{ background: 'rgba(243,173,44,0.1)', color: 'var(--accent-yellow)', padding: '2px 7px', borderRadius: '4px', fontFamily: 'var(--mono)', fontSize: '0.56rem' }}>
                      {'-' + pctOff + '% off MRP'}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{item.brand + ' · ' + item.category}</div>
              </div>

              <div style={{ textAlign: 'center', minWidth: '110px' }}>
                <div style={S.label}>Current</div>
                <div style={S.price}>{'₹' + item.priceIN.toLocaleString('en-IN')}</div>
              </div>

              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={S.label}>Your Target</div>
                {editTarget === item.name ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                      autoFocus
                      value={tempTarget}
                      onChange={(e) => setTempTarget(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTarget(item.name)
                      }}
                      placeholder='130000'
                      style={S.input}
                    />
                    <button onClick={() => saveTarget(item.name)} style={S.btnOk}>
                      OK
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditTarget(item.name)
                      setTempTarget(target ? String(target) : '')
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {target ? (
                      <div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '1.05rem', fontWeight: 800, color: hitTarget ? '#4caf50' : '#5b9bd5' }}>{'₹' + target.toLocaleString('en-IN')}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.54rem', color: hitTarget ? '#4caf50' : 'var(--accent-red)' }}>
                          {hitTarget ? 'below target' : diff !== null ? '₹' + diff.toLocaleString('en-IN') + ' away' : ''}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '4px', padding: '4px 8px' }}>Set target</div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
                <button onClick={() => window.open(item.amazonIN, '_blank', 'noopener,noreferrer')} style={S.btnBuy}>
                  BUY
                </button>
                <button onClick={() => remove(item.name)} style={S.btnRemove}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>♡</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '10px' }}>Your wishlist is empty</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Go to Search Devices and tap ♡ on any device to save it here</div>
          <button
            onClick={() => navigate('/catalog/search')}
            style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '11px 26px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700 }}
          >
            SEARCH DEVICES
          </button>
        </div>
      )}
    </div>
  )
}
