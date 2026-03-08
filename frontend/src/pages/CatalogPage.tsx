import { useNavigate } from "react-router-dom"

const trending = [
  { brand: "SAMSUNG", name: "Samsung Galaxy S26 Ultra", specs: "6.9in · 200MP · 12GB RAM · 5000mAh", priceIN: "INR 1,39,999", priceUS: "USD 1,299", tag: "NEW", tagColor: "#5b9bd5", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra", amazonUS: "https://www.amazon.com/s?k=Samsung+Galaxy+S26+Ultra" },
  { brand: "APPLE", name: "iPhone 16 Pro Max", specs: "6.9in · 48MP · 8GB RAM · 4685mAh", priceIN: "INR 1,57,000", priceUS: "USD 1,189", tag: "POPULAR", tagColor: "#f3ad2c", amazonIN: "https://www.amazon.in/s?k=iPhone+16+Pro+Max", amazonUS: "https://www.amazon.com/s?k=iPhone+16+Pro+Max" },
  { brand: "GOOGLE", name: "Google Pixel 9 Pro", specs: "6.3in · 50MP · 16GB RAM · 4700mAh", priceIN: "INR 1,07,999", priceUS: "USD 979", tag: "AI", tagColor: "#9b59b6", amazonIN: "https://www.amazon.in/s?k=Google+Pixel+9+Pro", amazonUS: "https://www.amazon.com/s?k=Google+Pixel+9+Pro" },
  { brand: "ONEPLUS", name: "OnePlus 13", specs: "6.82in · 50MP · 16GB RAM · 6000mAh", priceIN: "INR 67,999", priceUS: "USD 789", tag: "VALUE", tagColor: "#4caf50", amazonIN: "https://www.amazon.in/s?k=OnePlus+13", amazonUS: "https://www.amazon.com/s?k=OnePlus+13" },
]

const brands = [
  { name: "Samsung", icon: "S", count: "245 devices", q: "Samsung" },
  { name: "Apple", icon: "A", count: "189 devices", q: "Apple" },
  { name: "Google", icon: "G", count: "52 devices", q: "Google" },
  { name: "OnePlus", icon: "O", count: "78 devices", q: "OnePlus" },
  { name: "Xiaomi", icon: "X", count: "134 devices", q: "Xiaomi" },
  { name: "Sony", icon: "S", count: "67 devices", q: "Sony" },
  { name: "Motorola", icon: "M", count: "89 devices", q: "Motorola" },
  { name: "Nothing", icon: "N", count: "12 devices", q: "Nothing" },
  { name: "Huawei", icon: "H", count: "98 devices", q: "Huawei" },
  { name: "Nokia", icon: "N", count: "43 devices", q: "Nokia" },
  { name: "Realme", icon: "R", count: "76 devices", q: "Realme" },
  { name: "ASUS", icon: "A", count: "54 devices", q: "ASUS" },
]

const categories = [
  { name: "Smartphones", sub: "All mobile phones", q: "Smartphone" },
  { name: "Tablets", sub: "iPads and Android tablets", q: "Tablet" },
  { name: "Laptops", sub: "Ultrabooks, gaming, work", q: "Laptop" },
  { name: "Smartwatches", sub: "Wearables and fitness", q: "Smartwatch" },
  { name: "Earbuds", sub: "TWS and headphones", q: "Earbuds" },
  { name: "Cameras", sub: "Digital and mirrorless", q: "Camera" },
]

export default function CatalogPage() {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = e.target.querySelector("input").value.trim()
    if (q) navigate("/catalog/search?q=" + encodeURIComponent(q))
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>DEVICE CATALOG</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 20px" }}>Browse Devices</h1>
        <form onSubmit={handleSearch}>
          <div style={{ display: "flex", gap: "10px", maxWidth: "600px" }}>
            <input placeholder="Search iPhone 16 Pro, Samsung S26 Ultra, MacBook Air..."
              style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "13px 18px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.95rem", outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-yellow)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            <button type="submit" style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "13px 28px", borderRadius: "8px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>SEARCH</button>
          </div>
        </form>
      </div>

      {/* Trending */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-yellow)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>TRENDING NOW</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {trending.map(p => (
            <div key={p.name} style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "18px", cursor: "pointer", transition: "all 0.15s", position: "relative" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>
              <span style={{ position: "absolute", top: "12px", right: "12px", background: p.tagColor, color: "#fff", padding: "2px 7px", borderRadius: "3px", fontFamily: "var(--mono)", fontSize: "0.52rem", fontWeight: "700" }}>{p.tag}</span>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginBottom: "5px" }}>{p.brand}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px", lineHeight: 1.3, paddingRight: "40px" }}>{p.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "14px" }}>{p.specs}</div>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1rem", fontWeight: "800", color: "var(--accent-yellow)" }}>{p.priceIN}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>{p.priceUS}</div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={e => { e.stopPropagation(); window.open(p.amazonIN, "_blank") }}
                  style={{ flex: 1, background: "rgba(243,173,44,0.12)", border: "1px solid rgba(243,173,44,0.3)", color: "var(--accent-yellow)", padding: "6px 0", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: "700" }}>
                  Amazon.in
                </button>
                <button onClick={e => { e.stopPropagation(); window.open(p.amazonUS, "_blank") }}
                  style={{ flex: 1, background: "rgba(91,155,213,0.12)", border: "1px solid rgba(91,155,213,0.3)", color: "#5b9bd5", padding: "6px 0", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: "700" }}>
                  Amazon.com
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-yellow)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>BROWSE BY BRAND</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
          {brands.map(b => (
            <div key={b.name + b.q} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(b.q))}
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 12px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-yellow)", marginBottom: "6px" }}>{b.icon}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>{b.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: "3px" }}>{b.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-yellow)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>CATEGORIES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
          {categories.map(c => (
            <div key={c.name} onClick={() => navigate("/catalog/search?q=" + encodeURIComponent(c.q))}
              style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 14px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>{c.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
