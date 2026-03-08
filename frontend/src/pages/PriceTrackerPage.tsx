import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const trackedDevices = [
  {
    id: 1, name: "iPhone 16 Pro Max", brand: "Apple", current: 157000, mrp: 159900, low: 154000, high: 159900,
    history: [159900,159900,158000,157500,157000,156000,157000,157500,157000,156500,155000,157000,157000,157000].map((v,i) => ({ day: `D${i+1}`, price: v })),
    amazon: "https://www.amazon.in/s?k=iPhone+16+Pro+Max"
  },
  {
    id: 2, name: "Samsung Galaxy S26 Ultra", brand: "Samsung", current: 139999, mrp: 139999, low: 136000, high: 139999,
    history: [139999,139999,138500,138000,137500,138000,139000,138500,138000,137000,138000,139000,139999,139999].map((v,i) => ({ day: `D${i+1}`, price: v })),
    amazon: "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra"
  },
  {
    id: 3, name: "OnePlus 13", brand: "OnePlus", current: 67999, mrp: 69999, low: 64999, high: 69999,
    history: [69999,69999,68500,68000,67500,67000,67999,67500,67000,66500,67000,67999,67999,67999].map((v,i) => ({ day: `D${i+1}`, price: v })),
    amazon: "https://www.amazon.in/s?k=OnePlus+13"
  },
]

function CustomTooltip({ active, payload, label }) {
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
  const [selected, setSelected] = useState(trackedDevices[0])

  const dropFromMrp = Math.round((selected.mrp - selected.current) / selected.mrp * 100)
  const dropFromHigh = Math.round((selected.high - selected.current) / selected.high * 100)

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>TOOLS</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Price Tracker</h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>14-day price history · Highs, lows · Best time to buy</p>
        </div>
        <button onClick={() => navigate("/catalog/search")}
          style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: "700" }}>
          + TRACK DEVICE
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px" }}>
        {/* Device list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>TRACKING {trackedDevices.length} DEVICES</div>
          {trackedDevices.map(d => {
            const isActive = d.id === selected.id
            const pct = Math.round((d.mrp - d.current) / d.mrp * 100)
            return (
              <div key={d.id} onClick={() => setSelected(d)}
                style={{ background: isActive ? "rgba(243,173,44,0.08)" : "var(--sidebar-bg)", border: `1px solid ${isActive ? "var(--accent-yellow)" : "var(--border)"}`, borderRadius: "8px", padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginBottom: "3px" }}>{d.brand.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "8px", lineHeight: 1.2 }}>{d.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.9rem", fontWeight: "800", color: "var(--accent-yellow)" }}>₹{d.current.toLocaleString()}</div>
                  {pct > 0 && <span style={{ background: "#4caf5020", color: "#4caf50", padding: "2px 7px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: "700" }}>-{pct}%</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart + details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Header */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "4px" }}>{selected.brand.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)" }}>{selected.name}</div>
              </div>
              <button onClick={() => window.open(selected.amazon, "_blank")}
                style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "9px 18px", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "700" }}>
                BUY ON AMAZON ↗
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {[
                { label: "CURRENT", value: "₹" + selected.current.toLocaleString(), color: "var(--accent-yellow)" },
                { label: "14D LOW", value: "₹" + selected.low.toLocaleString(), color: "#4caf50" },
                { label: "14D HIGH", value: "₹" + selected.high.toLocaleString(), color: "var(--accent-red)" },
                { label: "OFF MRP", value: dropFromMrp + "%", color: "#5b9bd5" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.54rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>PRICE HISTORY — LAST 14 DAYS</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={selected.history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000).toFixed(0) + "K"} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" stroke="#f3ad2c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI verdict */}
          <div style={{ background: "rgba(91,155,213,0.06)", border: "1px solid rgba(91,155,213,0.2)", borderRadius: "8px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "#5b9bd5", background: "rgba(91,155,213,0.15)", border: "1px solid rgba(91,155,213,0.3)", padding: "4px 8px", borderRadius: "4px", flexShrink: 0 }}>AI</div>
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>
                {dropFromMrp > 5 ? "Good time to buy" : "Wait for a better deal"}
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {dropFromMrp > 5
                  ? `Currently ${dropFromMrp}% below MRP and near its 14-day low of ₹${selected.low.toLocaleString()}. Price is unlikely to drop much further soon.`
                  : `Price is near its 14-day high. Consider waiting — historically drops ${dropFromHigh}% from this level within 2 weeks.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
