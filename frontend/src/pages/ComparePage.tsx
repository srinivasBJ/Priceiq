import { useState } from "react"
import { useNavigate } from "react-router-dom"

const mockLookup = {
  "iphone 16 pro max": { name: "iPhone 16 Pro Max", brand: "Apple", category: "Smartphone", year: "2024", specs: [["Display","6.9in Super Retina XDR 120Hz"],["Processor","Apple A18 Pro"],["RAM","8GB"],["Storage","256GB / 512GB / 1TB"],["Camera","48MP + 48MP + 12MP"],["Battery","4685mAh 27W"]], prices: [{ store: "Amazon India", price: "INR 1,57,000", badge: "LOWEST IN", color: "#4caf50", url: "#" }, { store: "Amazon USA", price: "USD 1,189", badge: "", color: "#5b9bd5", url: "#" }, { store: "Flipkart", price: "INR 1,59,900", badge: "", color: "var(--text-muted)", url: "#" }, { store: "Apple Store India", price: "INR 1,59,900", badge: "MRP", color: "var(--text-muted)", url: "#" }, { store: "Apple Store USA", price: "USD 1,199", badge: "MRP", color: "var(--text-muted)", url: "#" }], score: 95, verdict: "Best price is on Amazon India — INR 2,900 below MRP. Buy now." },
  "samsung s26 ultra": { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Smartphone", year: "2026", specs: [["Display","6.9in LTPO AMOLED 120Hz"],["Processor","Snapdragon 8 Elite Gen 5"],["RAM","12GB / 16GB"],["Storage","256GB / 512GB / 1TB"],["Camera","200MP + 50MP + 50MP"],["Battery","5000mAh 60W"]], prices: [{ store: "Amazon India", price: "INR 1,38,999", badge: "LOWEST IN", color: "#4caf50", url: "#" }, { store: "Amazon USA", price: "USD 1,279", badge: "LOWEST US", color: "#4caf50", url: "#" }, { store: "Samsung India", price: "INR 1,39,999", badge: "MRP", color: "var(--text-muted)", url: "#" }, { store: "Flipkart", price: "INR 1,39,500", badge: "", color: "var(--text-muted)", url: "#" }], score: 92, verdict: "New launch — both Amazon IN and US offer slight savings over MRP." },
  "oneplus 13": { name: "OnePlus 13", brand: "OnePlus", category: "Smartphone", year: "2025", specs: [["Display","6.82in LTPO AMOLED 120Hz"],["Processor","Snapdragon 8 Elite"],["RAM","12GB / 16GB / 24GB"],["Storage","256GB / 512GB"],["Camera","50MP + 50MP + 50MP"],["Battery","6000mAh 100W"]], prices: [{ store: "Amazon India", price: "INR 67,999", badge: "LOWEST IN", color: "#4caf50", url: "#" }, { store: "Amazon USA", price: "USD 789", badge: "", color: "#5b9bd5", url: "#" }, { store: "OnePlus Store", price: "INR 69,999", badge: "MRP", color: "var(--text-muted)", url: "#" }, { store: "Flipkart", price: "INR 68,999", badge: "", color: "var(--text-muted)", url: "#" }], score: 85, verdict: "Amazon India has the best price — INR 2,000 off MRP. Excellent value." },
  "macbook air m4": { name: "MacBook Air M4", brand: "Apple", category: "Laptop", year: "2025", specs: [["Display","13.6in Liquid Retina 2560x1664"],["Processor","Apple M4 10-core CPU"],["RAM","16GB / 32GB unified"],["Storage","256GB / 512GB / 1TB SSD"],["Camera","12MP Center Stage"],["Battery","52.6Wh 18 hours"]], prices: [{ store: "Amazon India", price: "INR 1,12,000", badge: "LOWEST IN", color: "#4caf50", url: "#" }, { store: "Amazon USA", price: "USD 1,079", badge: "LOWEST US", color: "#4caf50", url: "#" }, { store: "Apple Store India", price: "INR 1,19,900", badge: "MRP", color: "var(--text-muted)", url: "#" }, { store: "Apple Store USA", price: "USD 1,099", badge: "MRP", color: "var(--text-muted)", url: "#" }], score: 93, verdict: "Amazon India saves you INR 7,900 vs Apple Store. Best time to buy." },
}

const suggestions = ["iPhone 16 Pro Max", "Samsung S26 Ultra", "OnePlus 13", "MacBook Air M4"]

export default function ComparePage() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const lookup = (q) => {
    setError("")
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const key = q.toLowerCase().trim()
      const match = Object.keys(mockLookup).find(k => key.includes(k) || k.includes(key.split(" ")[0]))
      if (match) {
        setResult(mockLookup[match])
      } else {
        setError("Product not found in our catalog yet. Try: " + suggestions.join(", "))
      }
      setLoading(false)
    }, 600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) lookup(input)
  }

  const sc = (s) => s >= 90 ? "#4caf50" : s >= 80 ? "#f3ad2c" : "#5b9bd5"

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>PRICE INTELLIGENCE</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Price Comparison</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Search any device or paste an Amazon link — compare prices instantly</p>
      </div>

      {/* Search box */}
      <div style={{ background: "linear-gradient(135deg, rgba(243,173,44,0.07), rgba(204,34,41,0.04))", border: "1px solid var(--border)", borderRadius: "10px", padding: "28px", marginBottom: "28px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px", fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>SEARCH DEVICE OR PASTE AMAZON LINK</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="e.g. iPhone 16 Pro Max  or  amazon.in/dp/B0ABC123..."
              style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--border)", borderRadius: "8px", padding: "13px 18px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.92rem", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-yellow)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            <button type="submit"
              style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "13px 24px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", flexShrink: 0 }}>
              COMPARE
            </button>
          </div>
        </form>
        <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>TRY:</span>
          {suggestions.map(s => (
            <button key={s} onClick={() => { setInput(s); lookup(s) }}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "3px 10px", borderRadius: "20px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.6rem", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.color = "var(--accent-yellow)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px", fontFamily: "var(--mono)", color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "3px" }}>
          COMPARING PRICES...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ background: "rgba(204,34,41,0.08)", border: "1px solid rgba(204,34,41,0.3)", borderRadius: "8px", padding: "16px 20px", fontFamily: "var(--sans)", fontSize: "0.85rem", color: "#cc2229" }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div>
          {/* Product header */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "22px", marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" }}>{result.brand} · {result.category} · {result.year}</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 12px" }}>{result.name}</h2>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {result.specs.map(([l, v]) => (
                    <div key={l} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem" }}>
                      <span style={{ color: "var(--accent-red)" }}>{l}: </span>
                      <span style={{ color: "var(--text-muted)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "20px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>AI SCORE</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "2.4rem", fontWeight: "800", color: sc(result.score), lineHeight: 1 }}>{result.score}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{result.score >= 90 ? "Excellent" : result.score >= 80 ? "Good" : "Average"}</div>
              </div>
            </div>
          </div>

          {/* Price comparison table */}
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "18px", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              PRICE COMPARISON — ALL STORES
            </div>
            {result.prices.map((p, i) => (
              <div key={p.store} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: i < result.prices.length - 1 ? "1px solid var(--border)" : "none", background: p.badge === "LOWEST IN" || p.badge === "LOWEST US" ? "rgba(76,175,80,0.05)" : "transparent" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "500", color: "var(--text-main)" }}>{p.store}</span>
                  {p.badge && <span style={{ marginLeft: "8px", background: p.color + "22", border: `1px solid ${p.color}44`, color: p.color, padding: "2px 7px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.52rem", fontWeight: "700" }}>{p.badge}</span>}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "700", color: p.color }}>{p.price}</div>
              </div>
            ))}
          </div>

          {/* AI Verdict */}
          <div style={{ background: "rgba(243,173,44,0.07)", border: "1px solid rgba(243,173,44,0.25)", borderRadius: "8px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "800", color: "var(--accent-yellow)", flexShrink: 0, marginTop: "2px" }}>AI</div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--accent-yellow)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px" }}>PRICE VERDICT</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.6 }}>{result.verdict}</div>
            </div>
          </div>

          <button onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(result.name))}
            style={{ marginTop: "14px", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "9px 18px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.68rem", textTransform: "uppercase" }}>
            VIEW FULL SPECS →
          </button>
        </div>
      )}
    </div>
  )
}
