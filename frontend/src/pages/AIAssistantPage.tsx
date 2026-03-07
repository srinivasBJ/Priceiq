import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m PriceIQ\'s AI assistant powered by Claude. Ask me anything about your pricing strategy, competitor analysis, or revenue optimization.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
        }),
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text } = JSON.parse(data)
            aiText += text
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: 'assistant', content: aiText }
              return updated
            })
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>INTELLIGENCE</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>AI Assistant</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Powered by Claude — ask anything about your pricing</p>
      </div>

      <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideIn 0.3s ease',
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.role === 'user' ? 'var(--accent-yellow)' : 'rgba(0,0,0,0.3)',
                color: msg.role === 'user' ? '#000' : 'var(--text-main)',
                fontSize: '0.88rem',
                lineHeight: '1.6',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                borderLeft: msg.role === 'assistant' ? '3px solid var(--accent-yellow)' : 'none',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '0.6rem',
                    color: 'var(--accent-yellow)',
                    letterSpacing: '1px',
                    marginBottom: '6px',
                  }}>✦ PRICEIQ AI</div>
                )}
                {msg.content || (loading && i === messages.length - 1 ? (
                  <span style={{ opacity: 0.5 }}>▋</span>
                ) : '')}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ padding: '0 22px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            'Analyze my pricing strategy',
            'Which products need price updates?',
            'How can I increase margins?',
            'Competitor pricing summary',
          ].map((prompt, i) => (
            <button key={i} onClick={() => setInput(prompt)} style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-yellow)'
              e.currentTarget.style.color = 'var(--accent-yellow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}>
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '16px 22px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '12px',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <input
            className="form-control"
            placeholder="Ask about pricing, margins, competitors..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            style={{ flex: 1 }}
          />
          <button onClick={send} disabled={loading || !input.trim()} className="btn btn-primary" style={{ flexShrink: 0 }}>
            {loading ? '...' : '→ SEND'}
          </button>
        </div>
      </div>
    </div>
  )
}