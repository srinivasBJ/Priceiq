import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const allDevices = [
  { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Smartphone", current: 138999, mrp: 139999, img: "SG", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+S26+Ultra" },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Smartphone", current: 126999, mrp: 129999, img: "SG", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+S25+Ultra" },
  { name: "Samsung Galaxy S25", brand: "Samsung", category: "Smartphone", current: 77999, mrp: 79999, img: "SG", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+S25" },
  { name: "Samsung Galaxy A56", brand: "Samsung", category: "Smartphone", current: 33999, mrp: 34999, img: "SG", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+A56" },
  { name: "iPhone 16 Pro Max", brand: "Apple", category: "Smartphone", current: 157000, mrp: 159900, img: "IP", amazonIN: "https://www.amazon.in/s?k=iPhone+16+Pro+Max" },
  { name: "iPhone 16 Pro", brand: "Apple", category: "Smartphone", current: 117000, mrp: 119900, img: "IP", amazonIN: "https://www.amazon.in/s?k=iPhone+16+Pro" },
  { name: "iPhone 16 Plus", brand: "Apple", category: "Smartphone", current: 87000, mrp: 89900, img: "IP", amazonIN: "https://www.amazon.in/s?k=iPhone+16+Plus" },
  { name: "iPhone 16", brand: "Apple", category: "Smartphone", current: 77900, mrp: 79900, img: "IP", amazonIN: "https://www.amazon.in/s?k=iPhone+16" },
  { name: "iPhone 15 Pro Max", brand: "Apple", category: "Smartphone", current: 109000, mrp: 119900, img: "IP", amazonIN: "https://www.amazon.in/s?k=iPhone+15+Pro+Max" },
  { name: "Google Pixel 9 Pro XL", brand: "Google", category: "Smartphone", current: 126999, mrp: 129999, img: "GP", amazonIN: "https://www.amazon.in/s?k=Google+Pixel+9+Pro+XL" },
  { name: "Google Pixel 9 Pro", brand: "Google", category: "Smartphone", current: 107999, mrp: 109999, img: "GP", amazonIN: "https://www.amazon.in/s?k=Google+Pixel+9+Pro" },
  { name: "Google Pixel 9", brand: "Google", category: "Smartphone", current: 77999, mrp: 79999, img: "GP", amazonIN: "https://www.amazon.in/s?k=Google+Pixel+9" },
  { name: "OnePlus 13", brand: "OnePlus", category: "Smartphone", current: 67999, mrp: 69999, img: "OP", amazonIN: "https://www.amazon.in/s?k=OnePlus+13" },
  { name: "OnePlus 13R", brand: "OnePlus", category: "Smartphone", current: 41999, mrp: 42999, img: "OP", amazonIN: "https://www.amazon.in/s?k=OnePlus+13R" },
  { name: "Xiaomi 15", brand: "Xiaomi", category: "Smartphone", current: 87999, mrp: 89999, img: "XI", amazonIN: "https://www.amazon.in/s?k=Xiaomi+15" },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Smartphone", current: 97999, mrp: 99999, img: "XI", amazonIN: "https://www.amazon.in/s?k=Xiaomi+14+Ultra" },
  { name: "Nothing Phone 3", brand: "Nothing", category: "Smartphone", current: 57999, mrp: 59999, img: "NP", amazonIN: "https://www.amazon.in/s?k=Nothing+Phone+3" },
  { name: "Nothing Phone 2a Plus", brand: "Nothing", category: "Smartphone", current: 23999, mrp: 24999, img: "NP", amazonIN: "https://www.amazon.in/s?k=Nothing+Phone+2a+Plus" },
  { name: "Sony Xperia 1 VI", brand: "Sony", category: "Smartphone", current: 124999, mrp: 129990, img: "SX", amazonIN: "https://www.amazon.in/s?k=Sony+Xperia+1+VI" },
  { name: "iPad Pro M4 13-inch", brand: "Apple", category: "Tablet", current: 165000, mrp: 169900, img: "iP", amazonIN: "https://www.amazon.in/s?k=iPad+Pro+M4+13" },
  { name: "iPad Pro M4 11-inch", brand: "Apple", category: "Tablet", current: 97000, mrp: 99900, img: "iP", amazonIN: "https://www.amazon.in/s?k=iPad+Pro+M4+11" },
  { name: "iPad Air M2 13-inch", brand: "Apple", category: "Tablet", current: 96999, mrp: 99900, img: "iA", amazonIN: "https://www.amazon.in/s?k=iPad+Air+M2+13" },
  { name: "iPad Air M2 11-inch", brand: "Apple", category: "Tablet", current: 67999, mrp: 69900, img: "iA", amazonIN: "https://www.amazon.in/s?k=iPad+Air+M2+11" },
  { name: "iPad 10th Gen", brand: "Apple", category: "Tablet", current: 42999, mrp: 44900, img: "iP", amazonIN: "https://www.amazon.in/s?k=iPad+10th+generation" },
  { name: "Samsung Galaxy Tab S10 Ultra", brand: "Samsung", category: "Tablet", current: 115999, mrp: 118999, img: "ST", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S10+Ultra" },
  { name: "Samsung Galaxy Tab S10+", brand: "Samsung", category: "Tablet", current: 86999, mrp: 89999, img: "ST", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S10" },
  { name: "Samsung Galaxy Tab S10 FE", brand: "Samsung", category: "Tablet", current: 47999, mrp: 49999, img: "ST", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+Tab+S10+FE" },
  { name: "MacBook Air M4 15-inch", brand: "Apple", category: "Laptop", current: 130000, mrp: 134900, img: "MB", amazonIN: "https://www.amazon.in/s?k=MacBook+Air+M4+15" },
  { name: "MacBook Air M4 13-inch", brand: "Apple", category: "Laptop", current: 112000, mrp: 114900, img: "MB", amazonIN: "https://www.amazon.in/s?k=MacBook+Air+M4+13" },
  { name: "MacBook Pro M4 14-inch", brand: "Apple", category: "Laptop", current: 165000, mrp: 169900, img: "MB", amazonIN: "https://www.amazon.in/s?k=MacBook+Pro+M4+14" },
  { name: "MacBook Pro M4 16-inch", brand: "Apple", category: "Laptop", current: 239000, mrp: 249900, img: "MB", amazonIN: "https://www.amazon.in/s?k=MacBook+Pro+M4+16" },
  { name: "AirPods Pro 2nd Gen", brand: "Apple", category: "Earbuds", current: 22999, mrp: 24900, img: "AP", amazonIN: "https://www.amazon.in/s?k=AirPods+Pro+2nd+Gen" },
  { name: "Sony WF-1000XM5", brand: "Sony", category: "Earbuds", current: 17999, mrp: 19990, img: "SW", amazonIN: "https://www.amazon.in/s?k=Sony+WF-1000XM5" },
  { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "Earbuds", current: 16999, mrp: 17999, img: "SB", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+Buds3+Pro" },
  { name: "Nothing Ear (3)", brand: "Nothing", category: "Earbuds", current: 9499, mrp: 9999, img: "NE", amazonIN: "https://www.amazon.in/s?k=Nothing+Ear+3" },
  { name: "Apple Watch Series 10", brand: "Apple", category: "Smartwatch", current: 44999, mrp: 46900, img: "AW", amazonIN: "https://www.amazon.in/s?k=Apple+Watch+Series+10" },
  { name: "Samsung Galaxy Watch 7", brand: "Samsung", category: "Smartwatch", current: 27999, mrp: 29999, img: "GW", amazonIN: "https://www.amazon.in/s?k=Samsung+Galaxy+Watch+7" },
]

type Device = typeof allDevices[0]

const S = {
  row: {
    background: "var(--sidebar-bg)",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  } as React.CSSProperties,
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    background: "rgba(243,173,44,0.1)",
    border: "1px solid rgba(243,173,44,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--mono)",
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "var(--accent-yellow)",
    flexShrink: 0,
  } as React.CSSProperties,
  label: {
    fontFamily: "var(--mono)",
    fontSize: "0.54rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    marginBottom: "3px",
  } as React.CSSProperties,
  price: {
    fontFamily: "var(--mono)",
    fontSize: "1.05rem",
    fontWeight: 800,
    color: "var(--accent-yellow)",
  } as React.CSSProperties,
  input: {
    width: "85px",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid var(--accent-yellow)",
    borderRadius: "4px",
    padding: "4px 7px",
    color: "var(--text-main)",
    fontFamily: "var(--mono)",
    fontSize: "0.72rem",
    outline: "none",
  } as React.CSSProperties,
  btnOk: {
    background: "var(--accent-yellow)",
    border: "none",
    color: "#000",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "var(--mono)",
    fontSize: "0.65rem",
    fontWeight: 700,
  } as React.CSSProperties,
  btnBuy: {
    background: "rgba(243,173,44,0.12)",
    border: "1px solid rgba(243,173,44,0.3)",
    color: "var(--accent-yellow)",
    padding: "7px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "var(--mono)",
    fontSize: "0.62rem",
    fontWeight: 700,
  } as React.CSSProperties,
  btnRemove: {
    background: "rgba(204,34,41,0.1)",
    border: "1px solid rgba(204,34,41,0.3)",
    color: "var(--accent-red)",
    padding: "7px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.8rem",
  } as React.CSSProperties,
}

export default function WishlistPage() {
  const navigate = useNavigate()

  const [names, setNames] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("piq_wishlist") || "[]") } catch { return [] }
  })

  const [targets, setTargets] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("piq_targets") || "{}") } catch { return {} }
  })

  const [editTarget, setEditTarget] = useState<string | null>(null)
  const [tempTarget, setTempTarget] = useState("")

  useEffect(() => {
    const sync = () => {
      try { setNames(JSON.parse(localStorage.getItem("piq_wishlist") || "[]")) } catch { return }
    }
    window.addEventListener("focus", sync)
    return () => window.removeEventListener("focus", sync)
  }, [])

  const items: Device[] = allDevices.filter(d => names.includes(d.name))

  const remove = (name: string) => {
    const next = names.filter(n => n !== name)
    setNames(next)
    localStorage.setItem("piq_wishlist", JSON.stringify(next))
  }

  const saveTarget = (name: string) => {
    const val = parseInt(tempTarget.replace(/[^0-9]/g, ""))
    if (!isNaN(val) && val > 0) {
      const next = { ...targets, [name]: val }
      setTargets(next)
      localStorage.setItem("piq_targets", JSON.stringify(next))
    }
    setEditTarget(null)
  }

  const below = items.filter(x => x.current <= (targets[x.name] ?? x.current * 0.9)).length
  const avgLeft = items.length === 0 ? 0 : Math.round(
    items.reduce((acc, x) => {
      const t = targets[x.name] ?? Math.round(x.current * 0.9)
      return acc + Math.max(0, (x.current - t) / x.current * 100)
    }, 0) / items.length
  )

  return (
    <div style={{ maxWidth: "920px" }}>

      <div style={{ marginBottom: "28px", paddingBottom: "18px", borderBottom: "2px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--accent-red)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "6px" }}>TOOLS</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 800, color: "var(--accent-yellow)", margin: "0 0 4px" }}>Wishlist</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
          {items.length === 0
            ? "Tap the heart on any device in Search to save it here"
            : "Save devices · Set target prices · Get drop alerts"}
        </p>
      </div>

      {items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "28px" }}>
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={S.label}>SAVED DEVICES</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-yellow)" }}>{items.length}</div>
          </div>
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={S.label}>BELOW TARGET</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", fontWeight: 800, color: "#4caf50" }}>{below}</div>
          </div>
          <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={S.label}>AVG SAVINGS LEFT</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", fontWeight: 800, color: "#5b9bd5" }}>{avgLeft + "%"}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map(item => {
          const target = targets[item.name]
          const pctOff = Math.round((item.mrp - item.current) / item.mrp * 100)
          const hitTarget = !!(target && item.current <= target)
          const diff = target ? item.current - target : null

          return (
            <div
              key={item.name}
              style={{ ...S.row, border: "1px solid " + (hitTarget ? "rgba(76,175,80,0.4)" : "var(--border)") }}
            >
              <div style={S.avatar}>{item.img}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {item.name}
                  </span>
                  {hitTarget && (
                    <span style={{ background: "#4caf5020", border: "1px solid #4caf5040", color: "#4caf50", padding: "2px 7px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.56rem", fontWeight: 700 }}>
                      TARGET HIT
                    </span>
                  )}
                  {pctOff > 0 && (
                    <span style={{ background: "rgba(243,173,44,0.1)", color: "var(--accent-yellow)", padding: "2px 7px", borderRadius: "4px", fontFamily: "var(--mono)", fontSize: "0.56rem" }}>
                      {"-" + pctOff + "% off MRP"}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>
                  {item.brand + " · " + item.category}
                </div>
              </div>

              <div style={{ textAlign: "center", minWidth: "110px" }}>
                <div style={S.label}>Current</div>
                <div style={S.price}>{"₹" + item.current.toLocaleString()}</div>
              </div>

              <div style={{ textAlign: "center", minWidth: "120px" }}>
                <div style={S.label}>Your Target</div>
                {editTarget === item.name ? (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      autoFocus
                      value={tempTarget}
                      onChange={e => setTempTarget(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveTarget(item.name) }}
                      placeholder="130000"
                      style={S.input}
                    />
                    <button onClick={() => saveTarget(item.name)} style={S.btnOk}>OK</button>
                  </div>
                ) : (
                  <div
                    onClick={() => { setEditTarget(item.name); setTempTarget(target ? String(target) : "") }}
                    style={{ cursor: "pointer" }}
                  >
                    {target ? (
                      <div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: "1.05rem", fontWeight: 800, color: hitTarget ? "#4caf50" : "#5b9bd5" }}>
                          {"₹" + target.toLocaleString()}
                        </div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: "0.54rem", color: hitTarget ? "#4caf50" : "var(--accent-red)" }}>
                          {hitTarget ? "below target" : (diff !== null ? "₹" + diff.toLocaleString() + " away" : "")}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)", border: "1px dashed var(--border)", borderRadius: "4px", padding: "4px 8px" }}>
                        Set target
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                <button onClick={() => window.open(item.amazonIN, "_blank")} style={S.btnBuy}>BUY</button>
                <button onClick={() => remove(item.name)} style={S.btnRemove}>✕</button>
              </div>

            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>♡</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--text-main)", marginBottom: "10px" }}>
            Your wishlist is empty
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
            Go to Search Devices and tap ♡ on any device to save it here
          </div>
          <button
            onClick={() => navigate("/catalog/search")}
            style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "11px 26px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.75rem", fontWeight: 700 }}
          >
            SEARCH DEVICES
          </button>
        </div>
      )}

    </div>
  )
}
