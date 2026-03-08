import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const DB = [
  { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Smartphone", priceIN: "INR 1,39,999", priceUS: "USD 1,299", amazonIN: "INR 1,38,999", amazonUS: "USD 1,279", year: "2026", score: 92, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.9in LTPO AMOLED 120Hz 2600nits"],["Processor","Snapdragon 8 Elite Gen 5"],["RAM","12GB / 16GB"],["Storage","256GB / 512GB / 1TB"],["Camera","200MP + 50MP + 50MP"],["Battery","5000mAh 60W wired 25W wireless"],["OS","Android 16 One UI 8"]] },
  { name: "iPhone 16 Pro Max", brand: "Apple", category: "Smartphone", priceIN: "INR 1,59,900", priceUS: "USD 1,199", amazonIN: "INR 1,57,000", amazonUS: "USD 1,189", year: "2024", score: 95, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.9in Super Retina XDR 120Hz 2000nits"],["Processor","Apple A18 Pro"],["RAM","8GB"],["Storage","256GB / 512GB / 1TB"],["Camera","48MP + 48MP + 12MP"],["Battery","4685mAh 27W wired 25W MagSafe"],["OS","iOS 18"]] },
  { name: "iPhone 16 Pro", brand: "Apple", category: "Smartphone", priceIN: "INR 1,19,900", priceUS: "USD 999", amazonIN: "INR 1,17,000", amazonUS: "USD 979", year: "2024", score: 91, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.3in Super Retina XDR 120Hz"],["Processor","Apple A18 Pro"],["RAM","8GB"],["Storage","128GB / 256GB / 512GB / 1TB"],["Camera","48MP + 48MP + 12MP"],["Battery","3582mAh 27W wired"],["OS","iOS 18"]] },
  { name: "Google Pixel 9 Pro", brand: "Google", category: "Smartphone", priceIN: "INR 1,09,999", priceUS: "USD 999", amazonIN: "INR 1,07,999", amazonUS: "USD 979", year: "2024", score: 88, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.3in LTPO OLED 120Hz 3000nits"],["Processor","Google Tensor G4"],["RAM","16GB"],["Storage","128GB / 256GB / 1TB"],["Camera","50MP + 48MP + 48MP"],["Battery","4700mAh 37W wired 23W wireless"],["OS","Android 15"]] },
  { name: "Google Pixel 9 Pro XL", brand: "Google", category: "Smartphone", priceIN: "INR 1,29,999", priceUS: "USD 1,099", amazonIN: "INR 1,26,999", amazonUS: "USD 1,069", year: "2024", score: 89, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.8in LTPO OLED 120Hz"],["Processor","Google Tensor G4"],["RAM","16GB"],["Storage","128GB / 256GB / 1TB"],["Camera","50MP + 48MP + 48MP"],["Battery","5060mAh 37W wired"],["OS","Android 15"]] },
  { name: "OnePlus 13", brand: "OnePlus", category: "Smartphone", priceIN: "INR 69,999", priceUS: "USD 799", amazonIN: "INR 67,999", amazonUS: "USD 789", year: "2025", score: 85, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.82in LTPO AMOLED 120Hz 4500nits"],["Processor","Snapdragon 8 Elite"],["RAM","12GB / 16GB / 24GB"],["Storage","256GB / 512GB"],["Camera","50MP + 50MP + 50MP"],["Battery","6000mAh 100W wired 50W wireless"],["OS","Android 15 OxygenOS 15"]] },
  { name: "OnePlus 13R", brand: "OnePlus", category: "Smartphone", priceIN: "INR 42,999", priceUS: "USD 499", amazonIN: "INR 41,999", amazonUS: "USD 489", year: "2025", score: 78, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.78in AMOLED 120Hz"],["Processor","Snapdragon 8 Gen 3"],["RAM","8GB / 16GB"],["Storage","128GB / 256GB"],["Camera","50MP + 8MP + 2MP"],["Battery","6000mAh 80W wired"],["OS","Android 15 OxygenOS 15"]] },
  { name: "MacBook Air M4", brand: "Apple", category: "Laptop", priceIN: "INR 1,14,900", priceUS: "USD 1,099", amazonIN: "INR 1,12,000", amazonUS: "USD 1,079", year: "2025", score: 93, specs: [["Network","Wi-Fi 6E Bluetooth 5.3"],["Display","13.6in Liquid Retina 2560x1664 500nits"],["Processor","Apple M4 10-core CPU 10-core GPU"],["RAM","16GB / 32GB unified memory"],["Storage","256GB / 512GB / 1TB / 2TB SSD"],["Camera","12MP Center Stage webcam"],["Battery","52.6Wh up to 18 hours"],["OS","macOS Sequoia 15"]] },
  { name: "MacBook Pro M4", brand: "Apple", category: "Laptop", priceIN: "INR 1,69,900", priceUS: "USD 1,599", amazonIN: "INR 1,65,000", amazonUS: "USD 1,559", year: "2024", score: 96, specs: [["Network","Wi-Fi 6E Bluetooth 5.3"],["Display","14.2in Liquid Retina XDR 120Hz 1000nits"],["Processor","Apple M4 Pro 12-core CPU 20-core GPU"],["RAM","24GB / 48GB unified memory"],["Storage","512GB / 1TB / 2TB SSD"],["Camera","12MP Center Stage webcam"],["Battery","72.4Wh up to 24 hours"],["OS","macOS Sequoia 15"]] },
  { name: "Samsung Galaxy Tab S10 Ultra", brand: "Samsung", category: "Tablet", priceIN: "INR 1,18,999", priceUS: "USD 1,099", amazonIN: "INR 1,15,999", amazonUS: "USD 1,069", year: "2024", score: 87, specs: [["Network","Wi-Fi 7 optional 5G"],["Display","14.6in AMOLED 120Hz 2960x1848"],["Processor","Snapdragon 8 Gen 3"],["RAM","12GB / 16GB"],["Storage","256GB / 512GB / 1TB"],["Camera","13MP + 8MP ultrawide"],["Battery","11200mAh 45W wired"],["OS","Android 14 One UI 6.1"]] },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Smartphone", priceIN: "INR 99,999", priceUS: "USD 899", amazonIN: "INR 97,999", amazonUS: "USD 879", year: "2024", score: 86, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.73in LTPO AMOLED 120Hz 3000nits"],["Processor","Snapdragon 8 Gen 3"],["RAM","12GB / 16GB"],["Storage","256GB / 512GB / 1TB"],["Camera","50MP Leica + 50MP + 50MP + 50MP"],["Battery","5000mAh 90W wired 80W wireless"],["OS","Android 14 HyperOS"]] },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "Smartphone", priceIN: "INR 69,999", priceUS: "USD 649", amazonIN: "INR 67,999", amazonUS: "USD 629", year: "2024", score: 82, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.36in AMOLED 120Hz 3000nits"],["Processor","Snapdragon 8 Gen 3"],["RAM","12GB"],["Storage","256GB / 512GB"],["Camera","50MP Leica + 50MP + 50MP"],["Battery","4610mAh 90W wired"],["OS","Android 14 HyperOS"]] },
  { name: "Sony Xperia 1 VI", brand: "Sony", category: "Smartphone", priceIN: "INR 1,29,990", priceUS: "USD 1,299", amazonIN: "INR 1,24,999", amazonUS: "USD 1,249", year: "2024", score: 82, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.5in OLED 120Hz 1080x2340"],["Processor","Snapdragon 8 Gen 3"],["RAM","12GB"],["Storage","256GB / 512GB"],["Camera","52MP Zeiss + 12MP + 50MP"],["Battery","5000mAh 30W wired"],["OS","Android 14"]] },
  { name: "Nothing Phone 3", brand: "Nothing", category: "Smartphone", priceIN: "INR 59,999", priceUS: "USD 649", amazonIN: "INR 57,999", amazonUS: "USD 629", year: "2025", score: 80, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.67in AMOLED 120Hz"],["Processor","Snapdragon 8s Gen 3"],["RAM","8GB / 12GB"],["Storage","128GB / 256GB"],["Camera","50MP + 50MP"],["Battery","4700mAh 65W wired"],["OS","Android 15 Nothing OS 3"]] },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Smartphone", priceIN: "INR 1,29,999", priceUS: "USD 1,199", amazonIN: "INR 1,26,999", amazonUS: "USD 1,179", year: "2025", score: 90, specs: [["Network","GSM / HSPA / LTE / 5G"],["Display","6.9in LTPO AMOLED 120Hz"],["Processor","Snapdragon 8 Elite"],["RAM","12GB"],["Storage","256GB / 512GB / 1TB"],["Camera","200MP + 50MP + 10MP + 50MP"],["Battery","5000mAh 45W wired"],["OS","Android 15 One UI 7"]] },
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState(DB)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(query)
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState("relevance")
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("piq_wishlist") || "[]") } catch { return [] }
  })
  const [tracked, setTracked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("piq_tracked") || "[]") } catch { return [] }
  })
  const toggleW = (name, e) => {
    e.stopPropagation()
    const next = wishlist.includes(name) ? wishlist.filter(x => x !== name) : [...wishlist, name]
    setWishlist(next)
    localStorage.setItem("piq_wishlist", JSON.stringify(next))
  }
  const toggleT = (name, e) => {
    e.stopPropagation()
    const next = tracked.includes(name) ? tracked.filter(x => x !== name) : [...tracked, name]
    setTracked(next)
    localStorage.setItem("piq_tracked", JSON.stringify(next))
  }

  useEffect(() => {
    setSearch(query)
    setSelected(null)
    setLoading(true)
    setTimeout(() => {
      if (!query) { setResults(DB); setLoading(false); return }
      const q = query.toLowerCase()
      const found = DB.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      setResults(found.length > 0 ? found : DB)
      setLoading(false)
    }, 300)
  }, [query])

  const sorted = [...results].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "price_low") return parseInt(a.amazonIN.replace(/[^0-9]/g,"")) - parseInt(b.amazonIN.replace(/[^0-9]/g,""))
    if (sortBy === "price_high") return parseInt(b.amazonIN.replace(/[^0-9]/g,"")) - parseInt(a.amazonIN.replace(/[^0-9]/g,""))
    return 0
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate("/catalog/search?q=" + encodeURIComponent(search.trim()))
  }

  const sc = (s) => s >= 90 ? "#4caf50" : s >= 80 ? "#f3ad2c" : "#5b9bd5"

  // ── Detail View ──
  if (selected) return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => setSelected(null)}
          style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem", textTransform: "uppercase" }}>
          BACK
        </button>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)" }}>
          {selected.brand} / {selected.category} / {selected.name}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }}>
        {/* Specs */}
        <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>{selected.brand} · {selected.category} · {selected.year}</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.9rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 6px" }}>{selected.name}</h1>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${sc(selected.score)}22`, border: `1px solid ${sc(selected.score)}44`, padding: "4px 10px", borderRadius: "4px", marginBottom: "24px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: sc(selected.score) }}>AI SCORE</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: sc(selected.score) }}>{selected.score}</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {selected.specs.map(([label, value], i) => (
                <tr key={label} style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.1)" : "transparent" }}>
                  <td style={{ padding: "11px 14px", fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", textTransform: "uppercase", fontWeight: "700", width: "120px", borderBottom: "1px solid var(--border)" }}>{label}</td>
                  <td style={{ padding: "11px 14px", fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-main)", borderBottom: "1px solid var(--border)" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Panel */}
        <div style={{ position: "sticky", top: "70px", alignSelf: "start" }}>
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderTop: "3px solid var(--accent-yellow)", borderRadius: "8px", padding: "20px", marginBottom: "12px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-yellow)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>PRICES</div>
            {[
              { store: "Amazon India", price: selected.amazonIN, sub: "amazon.in", color: "var(--accent-yellow)", best: true },
              { store: "Amazon USA", price: selected.amazonUS, sub: "amazon.com", color: "#5b9bd5", best: false },
              { store: "MRP India", price: selected.priceIN, sub: "official retail", color: "var(--text-muted)", best: false },
              { store: "MRP USA", price: selected.priceUS, sub: "official retail", color: "var(--text-muted)", best: false },
            ].map(s => (
              <div key={s.store} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: s.best ? "rgba(243,173,44,0.06)" : "rgba(0,0,0,0.2)", borderRadius: "6px", border: `1px solid ${s.best ? "rgba(243,173,44,0.2)" : "var(--border)"}`, marginBottom: "8px" }}>
                <div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.82rem", color: "var(--text-main)" }}>{s.store}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)" }}>{s.sub}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.92rem", fontWeight: "700", color: s.color }}>{s.price}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>AI PRICE SCORE</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "3rem", fontWeight: "800", color: sc(selected.score), lineHeight: 1 }}>{selected.score}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "6px" }}>
              {selected.score >= 90 ? "Excellent value for money" : selected.score >= 80 ? "Good value" : "Average value"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Results View ──
  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Search bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>DEVICE SEARCH</div>
        <form onSubmit={handleSearch}>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search phones, laptops, tablets..."
              style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 18px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.95rem", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-yellow)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            <button type="submit" style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase" }}>SEARCH</button>
            <button type="button" onClick={() => navigate("/catalog")} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "12px 18px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem", textTransform: "uppercase" }}>BROWSE</button>
          </div>
        </form>

        {/* Filter + sort row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>
            {loading ? "Searching..." : `${sorted.length} devices${query ? ` for "${query}"` : ""}`}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[["relevance","RELEVANCE"],["score","AI SCORE"],["price_low","PRICE LOW"],["price_high","PRICE HIGH"]].map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)}
                style={{ background: sortBy === val ? "var(--accent-yellow)" : "transparent", border: `1px solid ${sortBy === val ? "var(--accent-yellow)" : "var(--border)"}`, color: sortBy === val ? "#000" : "var(--text-muted)", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: sortBy === val ? "700" : "400" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", fontFamily: "var(--mono)", color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "3px" }}>SEARCHING...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
          {sorted.map(p => (
            <div key={p.name} onClick={() => setSelected(p)}
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "18px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "3px" }}>{p.brand} · {p.category} · {p.year}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)", lineHeight: 1.3 }}>{p.name}</div>
                </div>
                <div style={{ background: sc(p.score), color: "#000", padding: "4px 8px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.68rem", fontWeight: "700", flexShrink: 0, marginLeft: "8px" }}>{p.score}</div>
                <div style={{display:"flex",gap:"5px"}}>
                  <button
                    onClick={e => toggleW(p.name, e)}
                    style={{width:"28px",height:"28px",borderRadius:"5px",border:"1px solid "+(wishlist.includes(p.name)?"var(--accent-yellow)":"var(--border)"),background:wishlist.includes(p.name)?"rgba(243,173,44,0.15)":"rgba(255,255,255,0.04)",color:wishlist.includes(p.name)?"var(--accent-yellow)":"var(--text-muted)",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center"}}
                  >{wishlist.includes(p.name) ? "♥" : "♡"}</button>
                  <button
                    onClick={e => toggleT(p.name, e)}
                    style={{width:"28px",height:"28px",borderRadius:"5px",border:"1px solid "+(tracked.includes(p.name)?"#5b9bd5":"var(--border)"),background:tracked.includes(p.name)?"rgba(91,155,213,0.15)":"rgba(255,255,255,0.04)",color:tracked.includes(p.name)?"#5b9bd5":"var(--text-muted)",cursor:"pointer",fontSize:"0.6rem",fontWeight:"700",fontFamily:"var(--mono)",display:"flex",alignItems:"center",justifyContent:"center"}}
                  >↗</button>
                </div>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 2 }}>
                {p.specs.slice(1, 5).map(([l, v]) => <div key={l}><span style={{ color: "var(--accent-red)" }}>{l}:</span> {v}</div>)}
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "5px", padding: "8px 10px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--text-muted)", marginBottom: "2px" }}>AMAZON.IN</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", fontWeight: "700", color: "var(--accent-yellow)" }}>{p.amazonIN}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "5px", padding: "8px 10px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--text-muted)", marginBottom: "2px" }}>AMAZON.COM</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.82rem", fontWeight: "700", color: "#5b9bd5" }}>{p.amazonUS}</div>
                </div>
              </div>
              <div style={{ marginTop: "8px", fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--accent-yellow)", textAlign: "right" }}>VIEW SPECS →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
