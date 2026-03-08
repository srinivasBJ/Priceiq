import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const allDevices = [
  { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", current: 138999, mrp: 139999, low: 136000, high: 139999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra" },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", current: 126999, mrp: 129999, low: 124000, high: 129999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+S25+Ultra" },
  { name: "Samsung Galaxy S25+", brand: "Samsung", current: 96999, mrp: 99999, low: 94000, high: 99999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+S25+" },
  { name: "Samsung Galaxy S25", brand: "Samsung", current: 77999, mrp: 79999, low: 75000, high: 79999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+S25" },
  { name: "Samsung Galaxy A56", brand: "Samsung", current: 33999, mrp: 34999, low: 32000, high: 34999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+A56" },
  { name: "iPhone 16 Pro Max", brand: "Apple", current: 157000, mrp: 159900, low: 154000, high: 159900, amazon: "https://www.amazon.in/s?k=iPhone+16+Pro+Max" },
  { name: "iPhone 16 Pro", brand: "Apple", current: 117000, mrp: 119900, low: 114000, high: 119900, amazon: "https://www.amazon.in/s?k=iPhone+16+Pro" },
  { name: "iPhone 16 Plus", brand: "Apple", current: 87000, mrp: 89900, low: 84000, high: 89900, amazon: "https://www.amazon.in/s?k=iPhone+16+Plus" },
  { name: "iPhone 16", brand: "Apple", current: 77900, mrp: 79900, low: 75000, high: 79900, amazon: "https://www.amazon.in/s?k=iPhone+16" },
  { name: "Google Pixel 9 Pro", brand: "Google", current: 107999, mrp: 109999, low: 104000, high: 109999, amazon: "https://www.amazon.in/s?k=Google+Pixel+9+Pro" },
  { name: "Google Pixel 9", brand: "Google", current: 77999, mrp: 79999, low: 74000, high: 79999, amazon: "https://www.amazon.in/s?k=Google+Pixel+9" },
  { name: "OnePlus 13", brand: "OnePlus", current: 67999, mrp: 69999, low: 64999, high: 69999, amazon: "https://www.amazon.in/s?k=OnePlus+13" },
  { name: "OnePlus 13R", brand: "OnePlus", current: 41999, mrp: 42999, low: 39999, high: 42999, amazon: "https://www.amazon.in/s?k=OnePlus+13R" },
  { name: "Xiaomi 15", brand: "Xiaomi", current: 87999, mrp: 89999, low: 84000, high: 89999, amazon: "https://www.amazon.in/s?k=Xiaomi+15" },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", current: 97999, mrp: 99999, low: 94000, high: 99999, amazon: "https://www.amazon.in/s?k=Xiaomi+14+Ultra" },
  { name: "Nothing Phone 3", brand: "Nothing", current: 57999, mrp: 59999, low: 54999, high: 59999, amazon: "https://www.amazon.in/s?k=Nothing+Phone+3" },
  { name: "Nothing Phone 2a Plus", brand: "Nothing", current: 23999, mrp: 24999, low: 21999, high: 24999, amazon: "https://www.amazon.in/s?k=Nothing+Phone+2a+Plus" },
  { name: "iPad Pro M4 13-inch", brand: "Apple", current: 165000, mrp: 169900, low: 160000, high: 169900, amazon: "https://www.amazon.in/s?k=iPad+Pro+M4+13" },
  { name: "iPad Pro M4 11-inch", brand: "Apple", current: 97000, mrp: 99900, low: 94000, high: 99900, amazon: "https://www.amazon.in/s?k=iPad+Pro+M4+11" },
  { name: "iPad Air M2 11-inch", brand: "Apple", current: 67999, mrp: 69900, low: 65000, high: 69900, amazon: "https://www.amazon.in/s?k=iPad+Air+M2+11" },
  { name: "Samsung Galaxy Tab S10 Ultra", brand: "Samsung", current: 115999, mrp: 118999, low: 112000, high: 118999, amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S10+Ultra" },
  { name: "MacBook Air M4 13-inch", brand: "Apple", current: 112000, mrp: 114900, low: 109000, high: 114900, amazon: "https://www.amazon.in/s?k=MacBook+Air+M4+13" },
  { name: "MacBook Pro M4 14-inch", brand: "Apple", current: 165000, mrp: 169900, low: 160000, high: 169900, amazon: "https://www.amazon.in/s?k=MacBook+Pro+M4+14" },
  { name: "AirPods Pro 2nd Gen", brand: "Apple", current: 22999, mrp: 24900, low: 20999, high: 24900, amazon: "https://www.amazon.in/s?k=AirPods+Pro+2nd+Gen" },
  { name: "Sony WF-1000XM5", brand: "Sony", current: 17999, mrp: 19990, low: 15999, high: 19990, amazon: "https://www.amazon.in/s?k=Sony+WF-1000XM5" },
]

function makeHistory(base: number, low: number, high: number) {
  return Array.from({ length: 14 }, (_, i) => ({
    day: "D" + (i + 1),
    price: Math.round(low + Math.random() * (high - low) * 0.6 + (i % 3 === 0 ? (high - low) * 0.3 : 0))
  }))
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 12px", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
      <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>{label}</div>
      <div style={{ color: "var(--accent-yellow)" }}>₹{payload[0].value.toLocaleString()}</div>
    </div>
  )
}

export default function PriceTrackerPage() {
  const navigate = useNavigate()
  const [trackedNames, setTrackedNames] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("piq_tracked") || "[]") } catch { return [] }
  })

  useEffect(() => {
    const sync = () => {
      try { setTrackedNames(JSON.parse(localStorage.getItem("piq_tracked") || "[]")) } catch {}
    }
    window.addEventListener("focus", sync)
    return () => window.removeEventListener("focus", sync)
  }, [])

  const trackedDevices = allDevices.filter(d => trackedNames.includes(d.name))
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    if (trackedDevices.length > 0 && (!selected || !trackedDevices.find(d => d.name === selected.name))) {
      setSelected(trackedDevices[0])
    }
  }, [trackedNames])

  const removeTrack = (name: string) => {
    const next = trackedNames.filter(n => n !== name)
    setTrackedNames(next)
    localStorage.setItem("piq_tracked", JSON.stringify(next))
    if (selected?.name === name) setSelected(trackedDevices.filter(d => d.name !== name)[0] || null)
  }

  if (trackedDevices.length === 0) {
    return (
      <div style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>TOOLS</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: 0 }}>Price Tracker</h1>
        </div>
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>↗</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "10px" }}>No devices tracked yet</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>Go to Search Devices and tap ↗ on any device to track its price history</div>
          <button onClick={() => navigate("/catalog/search")} style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "11px 26px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.75rem", fontWeight: "700" }}>SEARCH DEVICES</button>
        </div>
      </div>
    )
  }

  const history = selected ? makeHistory(selected.current, selected.low, selected.high) : []
  const dropFromMrp = selected ? Math.round((selected.mrp - selected.current) / selected.mrp * 100) : 0

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>TOOLS</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Price Tracker</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>14-day price history · Highs, lows · Best time to buy</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>TRACKING {trackedDevices.length} DEVICES</div>
          {trackedDevices.map(d => {
            const isActive = selected?.name === d.name
            const pct = Math.round((d.mrp - d.current) / d.mrp * 100)
            return (
              <div key={d.name} style={{ position: "relative" }}>
                <div onClick={() => setSelected(d)}
                  style={{ background: isActive ? "rgba(243,173,44,0.08)" : "var(--sidebar-bg)", border: `1px solid ${isActive ? "var(--accent-yellow)" : "var(--border)"}`, borderRadius: "8px", padding: "12px 36px 12px 14px", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", marginBottom: "2px" }}>{d.brand.toUpperCase()}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px", lineHeight: 1.2 }}>{d.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", fontWeight: "800", color: "var(--accent-yellow)" }}>₹{d.current.toLocaleString()}</div>
                    {pct > 0 && <span style={{ background: "#4caf5020", color: "#4caf50", padding: "2px 6px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.56rem", fontWeight: "700" }}>-{pct}%</span>}
                  </div>
                </div>
                <button onClick={() => removeTrack(d.name)}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem", padding: "2px 4px" }}>✕</button>
              </div>
            )
          })}
        </div>

        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "3px" }}>{selected.brand.toUpperCase()}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>{selected.name}</div>
                </div>
                <button onClick={() => window.open(selected.amazon, "_blank")}
                  style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "9px 16px", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.68rem", fontWeight: "700" }}>BUY ON AMAZON ↗</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {[
                  { label: "CURRENT", value: "₹" + selected.current.toLocaleString(), color: "var(--accent-yellow)" },
                  { label: "14D LOW", value: "₹" + selected.low.toLocaleString(), color: "#4caf50" },
                  { label: "14D HIGH", value: "₹" + selected.high.toLocaleString(), color: "var(--accent-red)" },
                  { label: "OFF MRP", value: dropFromMrp + "%", color: "#5b9bd5" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 12px" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>PRICE HISTORY — LAST 14 DAYS</div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000).toFixed(0) + "K"} domain={["auto", "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="price" stroke="#f3ad2c" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "rgba(91,155,213,0.06)", border: "1px solid rgba(91,155,213,0.2)", borderRadius: "8px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "#5b9bd5", background: "rgba(91,155,213,0.15)", border: "1px solid rgba(91,155,213,0.3)", padding: "4px 8px", borderRadius: "4px", flexShrink: 0 }}>AI</div>
              <div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>
                  {dropFromMrp > 5 ? "Good time to buy" : "Wait for a better deal"}
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {dropFromMrp > 5
                    ? `Currently ${dropFromMrp}% below MRP and near its 14-day low of ₹${selected.low.toLocaleString()}. Prices are unlikely to drop much further soon.`
                    : `Price is near its 14-day high of ₹${selected.high.toLocaleString()}. Consider waiting — it typically drops ${dropFromMrp + 2}% within 2 weeks.`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
