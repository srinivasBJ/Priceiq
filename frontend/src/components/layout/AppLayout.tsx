import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { useState, useEffect } from "react"

const navItems = [
  { section: "MAIN" },
  { path: "/", label: "Dashboard", icon: "D" },
  { path: "/analytics", label: "Analytics", icon: "A" },
  { section: "CATALOG" },
  { path: "/catalog", label: "Browse Devices", icon: "C" },
  { path: "/catalog/search", label: "Search Devices", icon: "S" },
  { path: "/deals", label: "Deals & Drops", icon: "%" },
  { path: "/compare", label: "Compare Prices", icon: "=" },
  { section: "TOOLS" },
  { path: "/wishlist", label: "Wishlist", icon: "♡" },
  { path: "/tracker", label: "Price Tracker", icon: "↗" },
  { section: "SYSTEM" },
  { path: "/settings", label: "Settings", icon: "S" },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate("/catalog/search?q=" + encodeURIComponent(search.trim()))
      setSearch("")
    }
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <aside style={{ width: "220px", background: "var(--sidebar-bg)", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", position: "fixed", height: "100vh", zIndex: 100 }}>
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--accent-red)", letterSpacing: "2px", textTransform: "uppercase" }}>SYSTEM</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", lineHeight: 1.1 }}>PriceIQ</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: "2px" }}>Price Intelligence Platform</div>
        </div>
        <div style={{ padding: "8px 18px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.15)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: "6px", height: "6px", background: "var(--green)", borderRadius: "50%", boxShadow: "0 0 6px var(--green)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--green)" }}>LIVE - ALL SYSTEMS OK</span>
        </div>
        <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
          {navItems.map((item, i) => {
            if (item.section) return (
              <div key={i} style={{ padding: "12px 18px 3px", fontSize: "0.58rem", textTransform: "uppercase", color: "var(--accent-yellow)", letterSpacing: "2px", fontWeight: "700", fontFamily: "var(--mono)" }}>{item.section}</div>
            )
            return (
              <NavLink key={item.path} to={item.path} end={item.path === "/"}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: "10px", padding: "9px 18px",
                  color: isActive ? "#000" : "var(--text-muted)", textDecoration: "none",
                  fontSize: "0.86rem", borderLeft: isActive ? "3px solid var(--accent-yellow)" : "3px solid transparent",
                  background: isActive ? "var(--accent-yellow)" : "transparent", fontWeight: isActive ? "600" : "400",
                })}>
                <span style={{ fontSize: "0.72rem", width: "18px", textAlign: "center", fontFamily: "var(--mono)" }}>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-main)" }}>{user.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--accent-yellow)" }}>{user.role}</div>
              </div>
              <button onClick={() => logout()} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "4px 8px", borderRadius: "3px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.6rem" }}>OUT</button>
            </div>
          ) : (
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-muted)", textAlign: "center" }}>PRICEIQ v1.0</div>
          )}
        </div>
      </aside>

      <main style={{ marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ height: "56px", background: "var(--sidebar-bg)", display: "flex", alignItems: "center", padding: "0 24px", gap: "12px", borderBottom: "2px solid var(--accent-red)", position: "sticky", top: 0, zIndex: 50, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <form onSubmit={handleSearch} style={{ maxWidth: "480px", display: "flex", gap: "8px", flex: 1 }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search phones, laptops... or paste a product link"
              style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "7px 14px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.83rem", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-yellow)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")} />
            <button type="submit" style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.68rem", fontWeight: "700", flexShrink: 0 }}>GO</button>
          </form>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>{time.toLocaleTimeString()}</span>
          </div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>Hi, {user.name}</span>
              <button onClick={() => logout()} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem" }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
              <button onClick={() => navigate("/login")}
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", textTransform: "uppercase" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent-yellow)"; e.currentTarget.style.color = "var(--accent-yellow)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)" }}>
                Login
              </button>
              <button onClick={() => navigate("/login")}
                style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#e09c1a")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-yellow)")}>
                Sign Up
              </button>
            </div>
          )}
        </div>
        <div style={{ padding: "28px 36px", flex: 1 }}>
          <Outlet />
        </div>
      </main>

      <AIChatWidget />
    </div>
  )
}

function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! Ask me about any phone or product pricing." }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { token } = useAuthStore()

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)
    try {
      const res = await fetch("http://localhost:3001/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMsg }] }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiText = ""
      setMessages(prev => [...prev, { role: "assistant", content: "" }])
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === "[DONE]") break
          try { const parsed = JSON.parse(data); aiText += parsed.text; setMessages(prev => { const u = [...prev]; u[u.length-1] = { role: "assistant", content: aiText }; return u }) } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "AI needs ANTHROPIC_API_KEY in backend/.env" }])
    }
    setLoading(false)
  }

  return (
    <>
      {open && (
        <div style={{ position: "fixed", bottom: "80px", right: "20px", width: "340px", height: "460px", background: "var(--sidebar-bg)", border: "1px solid var(--border)", borderTop: "3px solid var(--accent-yellow)", borderRadius: "12px", display: "flex", flexDirection: "column", zIndex: 1000, boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent-yellow)" }}>PRICEIQ AI</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Powered by Claude</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}>x</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "8px 12px", borderRadius: "10px", fontSize: "0.82rem", lineHeight: 1.5, background: m.role === "user" ? "var(--accent-yellow)" : "rgba(255,255,255,0.05)", color: m.role === "user" ? "#000" : "var(--text-main)", border: m.role === "assistant" ? "1px solid var(--border)" : "none" }}>
                  {m.content || (loading && i === messages.length-1 ? "..." : "")}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything..."
              style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 10px", color: "var(--text-main)", fontFamily: "var(--sans)", fontSize: "0.82rem", outline: "none" }} />
            <button onClick={send} disabled={loading} style={{ background: "var(--accent-yellow)", border: "none", color: "#000", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontFamily: "var(--mono)", fontSize: "0.7rem", fontWeight: "700" }}>-&gt;</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        style={{ position: "fixed", bottom: "20px", right: "20px", width: "52px", height: "52px", background: open ? "var(--accent-red)" : "var(--accent-yellow)", border: "none", borderRadius: "50%", cursor: "pointer", zIndex: 1000, fontSize: "0.7rem", fontFamily: "var(--mono)", fontWeight: "700", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
        {open ? "X" : "AI"}
      </button>
    </>
  )
}
