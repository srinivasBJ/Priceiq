import { useState } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

const priceHistory = [
  { day: "Feb 1", iphone: 159900, samsung: 139999, pixel: 109999, oneplus: 69999 },
  { day: "Feb 5", iphone: 157000, samsung: 138999, pixel: 107999, oneplus: 67999 },
  { day: "Feb 10", iphone: 155000, samsung: 138999, pixel: 107999, oneplus: 67999 },
  { day: "Feb 15", iphone: 157000, samsung: 137999, pixel: 106999, oneplus: 66999 },
  { day: "Feb 20", iphone: 159000, samsung: 138999, pixel: 107999, oneplus: 67999 },
  { day: "Feb 25", iphone: 157000, samsung: 138999, pixel: 107999, oneplus: 67999 },
  { day: "Mar 1", iphone: 155000, samsung: 137000, pixel: 105999, oneplus: 65999 },
  { day: "Mar 8", iphone: 157000, samsung: 138999, pixel: 107999, oneplus: 67999 },
]

const brandDrops = [
  { brand: "Samsung", drops: 18 },
  { brand: "Apple", drops: 12 },
  { brand: "OnePlus", drops: 22 },
  { brand: "Google", drops: 15 },
  { brand: "Xiaomi", drops: 28 },
  { brand: "Sony", drops: 9 },
]

const categoryData = [
  { name: "Smartphones", value: 842, color: "#f3ad2c" },
  { name: "Laptops", value: 234, color: "#5b9bd5" },
  { name: "Tablets", value: 156, color: "#4caf50" },
  { name: "Earbuds", value: 203, color: "#cc2229" },
  { name: "Watches", value: 98, color: "#9b59b6" },
]

const topDrops = [
  { name: "Samsung Galaxy Tab S10+", from: "INR 89,999", to: "INR 79,999", pct: 11.1, days: 2 },
  { name: "Nothing Phone 3", from: "INR 64,999", to: "INR 57,999", pct: 10.8, days: 1 },
  { name: "OnePlus 13R", from: "INR 46,999", to: "INR 41,999", pct: 10.6, days: 3 },
  { name: "Google Pixel 9", from: "INR 82,999", to: "INR 74,999", pct: 9.6, days: 5 },
  { name: "OnePlus 13", from: "INR 74,999", to: "INR 67,999", pct: 9.3, days: 7 },
]

const volumeData = Array.from({ length: 30 }, (_, i) => ({
  day: "D" + (i + 1),
  searches: Math.floor(1000 + Math.random() * 600),
}))

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid var(--border)", borderRadius: "6px", padding: "10px 14px", fontFamily: "var(--mono)", fontSize: "0.72rem" }}>
      <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.value > 10000 ? "INR " + p.value.toLocaleString() : p.value}</div>
      ))}
    </div>
  )
}

function Panel({ title, sub, children }) {
  return (
    <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</span>
        {sub && <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)" }}>{sub}</span>}
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d")

  const stats = [
    { label: "DEVICES TRACKED", value: "1,533", sub: "+48 this week", color: "var(--accent-yellow)" },
    { label: "PRICE DROPS", value: "147", sub: "last 30 days", color: "#4caf50" },
    { label: "AVG DROP SIZE", value: "6.8%", sub: "across all brands", color: "#5b9bd5" },
    { label: "ALERTS TRIGGERED", value: "23", sub: "this month", color: "var(--accent-red)" },
  ]

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "24px", paddingBottom: "18px", borderBottom: "2px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>INSIGHTS</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Analytics</h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Price trends, drops, and market intelligence</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["7d", "30d", "90d"].map(r => (
            <button key={r} onClick={() => setRange(r)}
              style={{ background: range === r ? "var(--accent-yellow)" : "transparent", border: "1px solid " + (range === r ? "var(--accent-yellow)" : "var(--border)"), color: range === r ? "#000" : "var(--text-muted)", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: range === r ? "700" : "400" }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "18px", transition: "border-color 0.2s", cursor: "default" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = s.color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.9rem", fontWeight: "800", color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "5px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Panel title="PRICE HISTORY - TOP DEVICES" sub="Feb - Mar 2026">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000).toFixed(0) + "K"} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="iphone" stroke="#f3ad2c" strokeWidth={2} dot={false} name="iPhone 16 Pro Max" />
              <Line type="monotone" dataKey="samsung" stroke="#5b9bd5" strokeWidth={2} dot={false} name="S26 Ultra" />
              <Line type="monotone" dataKey="pixel" stroke="#4caf50" strokeWidth={2} dot={false} name="Pixel 9 Pro" />
              <Line type="monotone" dataKey="oneplus" stroke="#cc2229" strokeWidth={2} dot={false} name="OnePlus 13" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginTop: "8px" }}>
            {[["#f3ad2c","iPhone 16 Pro Max"],["#5b9bd5","S26 Ultra"],["#4caf50","Pixel 9 Pro"],["#cc2229","OnePlus 13"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
                <div style={{ width: "12px", height: "2px", background: c }} />{l}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <Panel title="PRICE DROPS BY BRAND" sub="last 30 days">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={brandDrops} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="brand" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="drops" fill="#f3ad2c" name="Drops" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="DEVICES BY CATEGORY">
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <PieChart width={160} height={160}>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              {categoryData.map(c => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color }} />
                    <span style={{ fontFamily: "var(--sans)", fontSize: "0.8rem", color: "var(--text-muted)" }}>{c.name}</span>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-main)", fontWeight: "600" }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Panel title="DAILY SEARCH VOLUME" sub="last 30 days">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={volumeData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f3ad2c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f3ad2c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 9, fill: "#a0a0a0" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="searches" stroke="#f3ad2c" strokeWidth={2} fill="url(#volGrad)" name="Searches" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="BIGGEST PRICE DROPS THIS WEEK">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["DEVICE","FROM","TO","DROP","DAYS AGO"].map(h => (
                <th key={h} style={{ padding: "8px 12px", fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topDrops.map((d, i) => (
              <tr key={i} style={{ cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px", fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-main)", borderBottom: "1px solid var(--border)" }}>{d.name}</td>
                <td style={{ padding: "12px", fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "line-through", borderBottom: "1px solid var(--border)" }}>{d.from}</td>
                <td style={{ padding: "12px", fontFamily: "var(--mono)", fontSize: "0.82rem", color: "var(--accent-yellow)", fontWeight: "700", borderBottom: "1px solid var(--border)" }}>{d.to}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ background: "#4caf5020", border: "1px solid #4caf5040", color: "#4caf50", padding: "3px 8px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "700" }}>-{d.pct}%</span>
                </td>
                <td style={{ padding: "12px", fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{d.days}d ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}
