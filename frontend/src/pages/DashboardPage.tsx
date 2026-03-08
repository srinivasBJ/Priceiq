import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts"

// ── Animated Number ───────────────────────────────────────────────
function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(0)
  useEffect(() => {
    const start = ref.current
    const end = value
    const duration = 1200
    const startTime = performance.now()
    const tick = (now) => {
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
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>
}

// ── Sparkline ─────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const min = Math.min(...data), max = Math.max(...data)
    const y = 100 - ((v - min) / (max - min + 1)) * 80
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width="80" height="32" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  )
}

// ── Custom Tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", fontFamily: "var(--mono)", fontSize: "0.75rem" }}>
      <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</div>
      ))}
    </div>
  )
}

// ── Price Score Ring ──────────────────────────────────────────────
function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0)
  const r = 54, circ = 2 * Math.PI * r
  const dash = (animated / 100) * circ
  const color = score >= 85 ? "#4caf50" : score >= 70 ? "#f3ad2c" : "#cc2229"

  useEffect(() => {
    const t = setTimeout(() => {
      let s = 0
      const step = () => { s += 1.2; if (s <= score) { setAnimated(Math.min(s, score)); requestAnimationFrame(step) } }
      requestAnimationFrame(step)
    }, 600)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <div style={{ position: "relative", width: "130px", height: "130px", flexShrink: 0 }}>
        <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 0.05s linear" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: "700", color, lineHeight: 1 }}>{Math.round(animated)}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--text-muted)", letterSpacing: "1px", marginTop: "2px" }}>SCORE</div>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--text-main)", marginBottom: "6px" }}>{score >= 85 ? "Excellent" : score >= 70 ? "Good" : "Needs Work"}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "180px" }}>Tracking {(score * 15).toFixed(0)} devices with live price data</div>
        <div style={{ marginTop: "12px", display: "inline-block", background: `${color}22`, border: `1px solid ${color}44`, color, padding: "4px 10px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          {score >= 85 ? "LIVE" : score >= 70 ? "UPDATING" : "SYNCING"}
        </div>
      </div>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────
const trendingDeals = [
  { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", priceIN: "INR 1,38,999", priceUS: "USD 1,279", drop: "NEW", dropVal: null, specs: "6.9in · SD8 Elite · 200MP", tag: "NEW", tagBg: "#5b9bd5", tagColor: "#fff" },
  { name: "iPhone 16 Pro Max", brand: "Apple", priceIN: "INR 1,57,000", priceUS: "USD 1,189", drop: "-3%", dropVal: -3, specs: "6.9in · A18 Pro · 48MP", tag: "HOT", tagBg: "#cc2229", tagColor: "#fff" },
  { name: "OnePlus 13", brand: "OnePlus", priceIN: "INR 67,999", priceUS: "USD 789", drop: "-8%", dropVal: -8, specs: "6.82in · SD8 Elite · 50MP", tag: "DEAL", tagBg: "#4caf50", tagColor: "#000" },
  { name: "Google Pixel 9 Pro", brand: "Google", priceIN: "INR 1,07,999", priceUS: "USD 979", drop: "-5%", dropVal: -5, specs: "6.3in · Tensor G4 · 50MP", tag: "AI", tagBg: "#9b59b6", tagColor: "#fff" },
  { name: "MacBook Air M4", brand: "Apple", priceIN: "INR 1,12,000", priceUS: "USD 1,079", drop: "NEW", dropVal: null, specs: "13.6in · M4 · 16GB RAM", tag: "NEW", tagBg: "#5b9bd5", tagColor: "#fff" },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", priceIN: "INR 97,999", priceUS: "USD 879", drop: "-6%", dropVal: -6, specs: "6.73in · SD8 Gen3 · Leica", tag: "DEAL", tagBg: "#4caf50", tagColor: "#000" },
]

const priceAlerts = [
  { name: "iPhone 16 Pro 256GB", target: "INR 1,10,000", current: "INR 1,19,900", status: "waiting", pct: 0 },
  { name: "Samsung S25 Ultra", target: "INR 1,00,000", current: "INR 1,05,000", status: "close", pct: 90 },
  { name: "MacBook Pro M4", target: "INR 1,50,000", current: "INR 1,49,000", status: "reached", pct: 100 },
]

const recentSearches = ["Samsung S26 Ultra", "iPhone 16 Pro", "OnePlus 13", "MacBook Air M4", "Pixel 9 Pro"]

const categories = [
  { name: "Smartphones", count: "842", icon: "S" },
  { name: "Laptops", count: "234", icon: "L" },
  { name: "Tablets", count: "156", icon: "T" },
  { name: "Smartwatches", count: "98", icon: "W" },
  { name: "Earbuds", count: "203", icon: "E" },
  { name: "Cameras", count: "87", icon: "C" },
]

const activityLog = [
  { text: "Price drop detected: OnePlus 13 down 8% on Amazon.in", time: "2m ago", type: "success" },
  { text: "New device listed: Samsung Galaxy S26 Ultra", time: "12m ago", type: "info" },
  { text: "Alert: iPhone 16 Pro still 8% above your target", time: "28m ago", type: "warning" },
  { text: "Xiaomi 14 Ultra price updated — INR 97,999", time: "1h ago", type: "success" },
  { text: "MacBook Pro M4 hit your target price!", time: "2h ago", type: "success" },
  { text: "Google Pixel 9 Pro price dropped INR 2,000", time: "3h ago", type: "info" },
]

const generatePriceHistory = () =>
  Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    amazon_in: Math.floor(135000 + Math.random() * 8000),
    amazon_us: Math.floor(117000 + Math.random() * 6000),
  }))

const generateDropData = () =>
  ["Samsung", "Apple", "Google", "OnePlus", "Xiaomi", "Sony"].map(brand => ({
    brand,
    drops: Math.floor(2 + Math.random() * 12),
  }))

// ── MAIN ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [visible, setVisible] = useState(false)
  const [priceHistory] = useState(generatePriceHistory)
  const [dropData] = useState(generateDropData)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate("/catalog/search?q=" + encodeURIComponent(search.trim()))
  }

  const statCards = [
    { label: "DEVICES TRACKED", value: 1533, suffix: "", sub: "across all categories", color: "var(--accent-yellow)", spark: [40,55,48,62,70,65,80,75,90,85,95,88], delay: 100 },
    { label: "PRICE DROPS TODAY", value: 47, suffix: "", sub: "updated in last hour", color: "#4caf50", spark: [5,8,6,10,7,12,9,14,11,16,13,18], delay: 200 },
    { label: "AVG SAVINGS", value: 12.4, suffix: "%", decimals: 1, sub: "vs retail MRP", color: "#5b9bd5", spark: [8,9,8,10,11,10,12,11,13,12,14,13], delay: 300 },
    { label: "ACTIVE ALERTS", value: 3, suffix: "", sub: "on your watchlist", color: "var(--accent-red)", spark: [1,2,1,3,2,4,3,5,4,3,4,3], delay: 400 },
  ]

  return (
    <div style={{ maxWidth: "1200px", opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px", paddingBottom: "20px", borderBottom: "2px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>PRICE INTELLIGENCE</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Dashboard</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Live device prices · India & USA · Updated every hour</p>
        </div>
        <button onClick={() => window.location.reload()}
          style={{ background: "var(--accent-yellow)", color: "#000", border: "none", padding: "10px 20px", borderRadius: "4px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#e09c1a"; e.currentTarget.style.transform = "translateY(-2px)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(0)" }}>
          REFRESH
        </button>
      </div>

      {/* Hero Search */}
      <div style={{ background: "linear-gradient(135deg, rgba(243,173,44,0.07) 0%, rgba(204,34,41,0.04) 100%)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px 32px 24px", marginBottom: "28px" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--text-main)", margin: "0 0 16px" }}>Find the best price on any device — India &amp; USA</p>
        <form onSubmit={handleSearch}>
          <div style={{ display: "flex", gap: "10px", maxWidth: "640px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search iPhone 16 Pro, Samsung S26, MacBook Air..."
              style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "8px", padding: "13px 18px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.95rem", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-yellow)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            <button type="submit" style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "13px 28px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", flexShrink: 0 }}>SEARCH</button>
          </div>
        </form>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>RECENT:</span>
          {recentSearches.map(s => (
            <button key={s} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(s))}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "3px 10px", borderRadius: "20px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.6rem", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.color = "var(--accent-yellow)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", transition: "all 0.25s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.boxShadow = `0 0 20px ${s.color}22` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: "700", color: s.color, lineHeight: 1 }}>
                  <AnimatedNumber value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "6px" }}>{s.sub}</div>
              </div>
              <Sparkline data={s.spark} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

        {/* Price History Chart */}
        <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>PRICE TREND — 14 DAYS</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)" }}>S26 Ultra sample</span>
          </div>
          <div style={{ padding: "16px 8px 12px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={priceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f3ad2c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f3ad2c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="usGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5b9bd5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5b9bd5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amazon_in" stroke="#f3ad2c" strokeWidth={2} fill="url(#inGrad)" name="Amazon.in" dot={false} />
                <Area type="monotone" dataKey="amazon_us" stroke="#5b9bd5" strokeWidth={2} fill="url(#usGrad)" name="Amazon.com" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", paddingRight: "10px" }}>
              {[{ color: "#f3ad2c", label: "Amazon.in" }, { color: "#5b9bd5", label: "Amazon.com" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
                  <div style={{ width: "10px", height: "2px", background: l.color, borderRadius: "2px" }} />{l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Drops by Brand */}
        <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>PRICE DROPS BY BRAND — TODAY</span>
          </div>
          <div style={{ padding: "16px 8px 12px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dropData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="brand" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="drops" fill="#f3ad2c" name="Drops" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trending Deals */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-yellow)", letterSpacing: "2px", textTransform: "uppercase" }}>TRENDING DEALS</span>
          <button onClick={() => navigate("/catalog")} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "5px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.6rem", textTransform: "uppercase" }}>VIEW ALL</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {trendingDeals.map(p => (
            <div key={p.name} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(p.name))}
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{p.brand}</span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <span style={{ background: p.tagBg, color: p.tagColor, padding: "2px 6px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.52rem", fontWeight: "700" }}>{p.tag}</span>
                  <span style={{ background: "rgba(0,0,0,0.3)", color: p.dropVal ? "#4caf50" : "#5b9bd5", padding: "2px 6px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.52rem", fontWeight: "700" }}>{p.drop}</span>
                </div>
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "5px", lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "12px" }}>{p.specs}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.92rem", fontWeight: "700", color: "var(--accent-yellow)" }}>{p.priceIN}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{p.priceUS}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Categories + Score + Alerts + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

        {/* Categories */}
        <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>BROWSE CATEGORIES</span>
          </div>
          <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {categories.map(c => (
              <div key={c.name} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(c.name))}
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "7px", padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-yellow)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-yellow)", marginBottom: "5px" }}>{c.icon}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-main)" }}>{c.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", marginTop: "3px" }}>{c.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score + Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Score */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px" }}>CATALOG COVERAGE</div>
            <ScoreRing score={87} />
          </div>

          {/* Price Alerts */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>PRICE ALERTS</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--accent-yellow)" }}>3 ACTIVE</span>
            </div>
            <div style={{ padding: "12px" }}>
              {priceAlerts.map(a => {
                const sc = a.status === "reached" ? "#4caf50" : a.status === "close" ? "#f3ad2c" : "var(--text-muted)"
                return (
                  <div key={a.name} style={{ borderLeft: `3px solid ${sc}`, paddingLeft: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)" }}>{a.name}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "700", color: sc }}>{a.current}</span>
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)" }}>Target: {a.target} · <span style={{ color: sc, textTransform: "uppercase" }}>{a.status === "reached" ? "REACHED!" : a.status === "close" ? "ALMOST" : "WAITING"}</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>ACTIVITY LOG</span>
          <span style={{ width: "8px", height: "8px", background: "#4caf50", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 6px #4caf50" }} />
        </div>
        <div style={{ padding: "8px 20px" }}>
          {activityLog.map((item, i) => {
            const colors = { success: "#4caf50", warning: "#f3ad2c", info: "#5b9bd5" }
            const icons = { success: "✓", warning: "!", info: "→" }
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < activityLog.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: `${colors[item.type]}22`, border: `1px solid ${colors[item.type]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.58rem", color: colors[item.type], flexShrink: 0, fontWeight: "bold" }}>{icons[item.type]}</div>
                <span style={{ flex: 1, fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.text}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", opacity: 0.6, flexShrink: 0 }}>{item.time}</span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}