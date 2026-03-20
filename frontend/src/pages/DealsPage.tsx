import { useState } from "react"
import { useNavigate } from "react-router-dom"

const deals = [
  { name: "OnePlus 13", brand: "OnePlus", category: "Smartphone", mrp: "INR 74,999", price: "INR 67,999", priceUS: "USD 789", drop: 9.3, specs: "6.82in · SD8 Elite · 6000mAh", tag: "BEST DEAL", tagColor: "#4caf50", score: 85 },
  { name: "Samsung Galaxy S25+", brand: "Samsung", category: "Smartphone", mrp: "INR 1,09,999", price: "INR 99,999", priceUS: "USD 949", drop: 9.1, specs: "6.7in · SD8 Elite · 45MP", tag: "HOT", tagColor: "#cc2229", score: 88 },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Smartphone", mrp: "INR 1,04,999", price: "INR 97,999", priceUS: "USD 879", drop: 6.7, specs: "6.73in · SD8 Gen3 · Leica 50MP", tag: "DEAL", tagColor: "#f3ad2c", score: 86 },
  { name: "Google Pixel 9 Pro", brand: "Google", category: "Smartphone", mrp: "INR 1,13,999", price: "INR 1,07,999", priceUS: "USD 979", drop: 5.3, specs: "6.3in · Tensor G4 · 50MP", tag: "AI PICK", tagColor: "#9b59b6", score: 88 },
  { name: "iPhone 16 Pro Max", brand: "Apple", category: "Smartphone", mrp: "INR 1,59,900", price: "INR 1,57,000", priceUS: "USD 1,189", drop: 1.8, specs: "6.9in · A18 Pro · 48MP", tag: "POPULAR", tagColor: "#5b9bd5", score: 95 },
  { name: "Nothing Phone 3", brand: "Nothing", category: "Smartphone", mrp: "INR 64,999", price: "INR 57,999", priceUS: "USD 629", drop: 10.8, specs: "6.67in · SD8s Gen3 · Glyph", tag: "TOP DROP", tagColor: "#4caf50", score: 80 },
  { name: "MacBook Air M4 13in", brand: "Apple", category: "Laptop", mrp: "INR 1,19,900", price: "INR 1,12,000", priceUS: "USD 1,079", drop: 6.6, specs: "13.6in · M4 · 16GB · 18hr battery", tag: "DEAL", tagColor: "#f3ad2c", score: 93 },
  { name: "Samsung Galaxy Tab S10+", brand: "Samsung", category: "Tablet", mrp: "INR 89,999", price: "INR 79,999", priceUS: "USD 859", drop: 11.1, specs: "12.4in · AMOLED · SD8 Gen3", tag: "TOP DROP", tagColor: "#4caf50", score: 84 },
  { name: "Sony Xperia 1 VI", brand: "Sony", category: "Smartphone", mrp: "INR 1,34,990", price: "INR 1,24,999", priceUS: "USD 1,249", drop: 7.4, specs: "6.5in · SD8 Gen3 · Zeiss 52MP", tag: "DEAL", tagColor: "#f3ad2c", score: 82 },
  { name: "OnePlus 13R", brand: "OnePlus", category: "Smartphone", mrp: "INR 46,999", price: "INR 41,999", priceUS: "USD 489", drop: 10.6, specs: "6.78in · SD8 Gen3 · 6000mAh", tag: "VALUE", tagColor: "#4caf50", score: 78 },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "Smartphone", mrp: "INR 74,999", price: "INR 67,999", priceUS: "USD 629", drop: 9.3, specs: "6.36in · SD8 Gen3 · Leica", tag: "DEAL", tagColor: "#f3ad2c", score: 82 },
  { name: "Google Pixel 9", brand: "Google", category: "Smartphone", mrp: "INR 82,999", price: "INR 74,999", priceUS: "USD 799", drop: 9.6, specs: "6.3in · Tensor G4 · 50MP", tag: "DEAL", tagColor: "#f3ad2c", score: 84 },
]

const categories = ["All", "Smartphone", "Laptop", "Tablet"]

export default function DealsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("All")
  const [sortBy, setSortBy] = useState("drop")

  const filtered = deals
    .filter(d => filter === "All" || d.category === filter)
    .sort((a, b) => sortBy === "drop" ? b.drop - a.drop : sortBy === "price" ? parseInt(a.price.replace(/[^0-9]/g,"")) - parseInt(b.price.replace(/[^0-9]/g,"")) : b.score - a.score)

  const sc = (s) => s >= 90 ? "#4caf50" : s >= 80 ? "#f3ad2c" : "#5b9bd5"
  const totalDrops = deals.length
  const avgDrop = (deals.reduce((a, b) => a + b.drop, 0) / deals.length).toFixed(1)
  const bestDrop = Math.max(...deals.map(d => d.drop)).toFixed(1)

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", paddingBottom: "18px", borderBottom: "2px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>LIVE PRICES</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Deals & Price Drops</h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Biggest price drops on Amazon India right now</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {[
              { label: "DEALS TODAY", value: totalDrops, color: "var(--accent-yellow)" },
              { label: "AVG DROP", value: avgDrop + "%", color: "#4caf50" },
              { label: "BIGGEST DROP", value: bestDrop + "%", color: "#cc2229" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>{s.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", fontWeight: "800", color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 hero deals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {filtered.slice(0, 3).map((d, i) => (
          <div key={d.name} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(d.name))}
            style={{ background: i === 0 ? "linear-gradient(135deg, rgba(243,173,44,0.12), rgba(243,173,44,0.03))" : "var(--sidebar-bg)", border: `1px solid ${i === 0 ? "rgba(243,173,44,0.4)" : "var(--border)"}`, borderRadius: "10px", padding: "20px", cursor: "pointer", transition: "all 0.15s", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
            {i === 0 && <div style={{ position: "absolute", top: "12px", right: "12px", background: "var(--accent-yellow)", color: "#000", padding: "3px 8px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.55rem", fontWeight: "800" }}>BEST DEAL</div>}
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>{d.brand}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px", lineHeight: 1.3 }}>{d.name}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "14px" }}>{d.specs}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textDecoration: "line-through", marginBottom: "2px" }}>{d.mrp}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-yellow)" }}>{d.price}</div>
              </div>
              <div style={{ background: "#4caf5022", border: "1px solid #4caf5044", padding: "6px 12px", borderRadius: "6px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.2rem", fontWeight: "800", color: "#4caf50" }}>-{d.drop}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ background: filter === c ? "var(--accent-yellow)" : "transparent", border: `1px solid ${filter === c ? "var(--accent-yellow)" : "var(--border)"}`, color: filter === c ? "#000" : "var(--text-muted)", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: filter === c ? "700" : "400" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>SORT:</span>
          {[["drop","BIGGEST DROP"],["price","LOWEST PRICE"],["score","AI SCORE"]].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)}
              style={{ background: sortBy === val ? "rgba(243,173,44,0.15)" : "transparent", border: `1px solid ${sortBy === val ? "var(--accent-yellow)" : "var(--border)"}`, color: sortBy === val ? "var(--accent-yellow)" : "var(--text-muted)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.58rem" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* All deals list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((d, i) => (
          <div key={d.name} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(d.name))}
            style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateX(4px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateX(0)" }}>
            {/* Rank */}
            <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: i < 3 ? "var(--accent-yellow)" : "var(--text-muted)", width: "28px", flexShrink: 0, textAlign: "center" }}>#{i+1}</div>
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: "0.92rem", fontWeight: "600", color: "var(--text-main)" }}>{d.name}</span>
                <span style={{ background: d.tagColor + "22", border: `1px solid ${d.tagColor}44`, color: d.tagColor, padding: "1px 6px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.52rem", fontWeight: "700" }}>{d.tag}</span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>{d.brand} · {d.category} · {d.specs}</div>
            </div>
            {/* Score */}
            <div style={{ background: sc(d.score), color: "#000", padding: "3px 8px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: "700", flexShrink: 0 }}>{d.score}</div>
            {/* MRP */}
            <div style={{ textAlign: "right", flexShrink: 0, minWidth: "100px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", textDecoration: "line-through" }}>{d.mrp}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.88rem", fontWeight: "700", color: "var(--accent-yellow)" }}>{d.price}</div>
            </div>
            {/* Drop badge */}
            <div style={{ background: "#4caf5015", border: "1px solid #4caf5033", borderRadius: "6px", padding: "8px 14px", flexShrink: 0, textAlign: "center", minWidth: "70px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: "#4caf50" }}>-{d.drop}%</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.5rem", color: "var(--text-muted)", textTransform: "uppercase" }}>drop</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
