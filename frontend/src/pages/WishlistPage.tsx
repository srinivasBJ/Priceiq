import { useState } from "react"
import { useNavigate } from "react-router-dom"

const defaultWishlist = [
  { id: 1, name: "iPhone 16 Pro Max", brand: "Apple", category: "Smartphone", targetPrice: 145000, currentPrice: 157000, mrp: 159900, drop: false, amazonIN: "https://www.amazon.in/s?k=iPhone+16+Pro+Max", img: "IP" },
  { id: 2, name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Smartphone", targetPrice: 130000, currentPrice: 139999, mrp: 139999, drop: false, amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra", img: "SG" },
  { id: 3, name: "MacBook Air M4", brand: "Apple", category: "Laptop", targetPrice: 100000, currentPrice: 112000, mrp: 114900, drop: true, amazonIN: "https://www.amazon.in/s?k=MacBook+Air+M4", img: "MB" },
  { id: 4, name: "OnePlus 13", brand: "OnePlus", category: "Smartphone", targetPrice: 60000, currentPrice: 67999, mrp: 69999, drop: false, amazonIN: "https://www.amazon.in/s?k=OnePlus+13", img: "OP" },
]

export default function WishlistPage() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(defaultWishlist)
  const [search, setSearch] = useState("")
  const [editTarget, setEditTarget] = useState<number|null>(null)
  const [tempTarget, setTempTarget] = useState("")

  const remove = (id: number) => setWishlist(w => w.filter(x => x.id !== id))
  const saveTarget = (id: number) => {
    setWishlist(w => w.map(x => x.id === id ? { ...x, targetPrice: parseInt(tempTarget) || x.targetPrice } : x))
    setEditTarget(null)
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>TOOLS</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: "800", color: "var(--accent-yellow)", margin: "0 0 4px" }}>Wishlist</h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Save devices · Set target prices · Get drop alerts</p>
        </div>
        <button onClick={() => navigate("/catalog/search")}
          style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase" }}>
          + ADD DEVICE
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "SAVED DEVICES", value: wishlist.length, color: "var(--accent-yellow)" },
          { label: "BELOW TARGET", value: wishlist.filter(x => x.currentPrice <= x.targetPrice).length, color: "#4caf50" },
          { label: "AVG SAVINGS LEFT", value: Math.round(wishlist.reduce((a, x) => a + ((x.currentPrice - x.targetPrice) / x.currentPrice * 100), 0) / wishlist.length) + "%", color: "#5b9bd5" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", fontWeight: "800", color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {wishlist.map(item => {
          const diff = item.currentPrice - item.targetPrice
          const pctOff = Math.round((item.mrp - item.currentPrice) / item.mrp * 100)
          const hitTarget = diff <= 0
          return (
            <div key={item.id} style={{ background: "var(--sidebar-bg)", border: `1px solid ${hitTarget ? "rgba(76,175,80,0.4)" : "var(--border)"}`, borderRadius: "10px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "18px", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = hitTarget ? "#4caf50" : "var(--accent-yellow)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = hitTarget ? "rgba(76,175,80,0.4)" : "var(--border)")}>
              {/* Avatar */}
              <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "rgba(243,173,44,0.12)", border: "1px solid rgba(243,173,44,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "800", color: "var(--accent-yellow)", flexShrink: 0 }}>{item.img}</div>
              
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>{item.name}</span>
                  {hitTarget && <span style={{ background: "#4caf5020", border: "1px solid #4caf5040", color: "#4caf50", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.58rem", fontWeight: "700" }}>TARGET HIT!</span>}
                  {pctOff > 0 && <span style={{ background: "rgba(243,173,44,0.1)", border: "1px solid rgba(243,173,44,0.2)", color: "var(--accent-yellow)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.58rem" }}>-{pctOff}% off MRP</span>}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-muted)" }}>{item.brand} · {item.category}</div>
              </div>

              {/* Prices */}
              <div style={{ textAlign: "center", minWidth: "110px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Current</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-yellow)" }}>₹{item.currentPrice.toLocaleString()}</div>
              </div>

              {/* Target */}
              <div style={{ textAlign: "center", minWidth: "120px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.56rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Your Target</div>
                {editTarget === item.id ? (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input autoFocus value={tempTarget} onChange={e => setTempTarget(e.target.value)} onKeyDown={e => e.key === "Enter" && saveTarget(item.id)}
                      style={{ width: "80px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--accent-yellow)", borderRadius: "4px", padding: "4px 8px", color: "var(--text-main)", fontFamily: "var(--mono)", fontSize: "0.75rem", outline: "none" }} />
                    <button onClick={() => saveTarget(item.id)} style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: "700" }}>✓</button>
                  </div>
                ) : (
                  <div onClick={() => { setEditTarget(item.id); setTempTarget(String(item.targetPrice)) }} style={{ cursor: "pointer" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: "800", color: hitTarget ? "#4caf50" : "#5b9bd5" }}>₹{item.targetPrice.toLocaleString()}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: hitTarget ? "#4caf50" : "var(--accent-red)" }}>
                      {hitTarget ? "✓ below target" : `₹${diff.toLocaleString()} away`}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button onClick={() => window.open(item.amazonIN, "_blank")}
                  style={{ background: "rgba(243,173,44,0.12)", border: "1px solid rgba(243,173,44,0.3)", color: "var(--accent-yellow)", padding: "7px 14px", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: "700" }}>
                  BUY ↗
                </button>
                <button onClick={() => remove(item.id)}
                  style={{ background: "rgba(204,34,41,0.1)", border: "1px solid rgba(204,34,41,0.3)", color: "var(--accent-red)", padding: "7px 10px", borderRadius: "5px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem" }}>
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {wishlist.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "2rem", marginBottom: "12px" }}>♡</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "1rem", marginBottom: "16px" }}>Your wishlist is empty</div>
          <button onClick={() => navigate("/catalog/search")} style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: "700" }}>BROWSE DEVICES</button>
        </div>
      )}
    </div>
  )
}
