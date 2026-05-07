import { useState, useEffect } from 'react'
import api from '../api'

function MessageList({ messages, onOpen, type }) {
  if (messages.length === 0) {
    return <div className="empty-state"><p>No messages in your {type}.</p></div>
  }
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className="card message-item" onClick={() => onOpen(msg)}
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '0.75rem',
            cursor: 'pointer',
            borderLeft: `4px solid ${!msg.is_read && type === 'inbox' ? 'var(--primary)' : 'var(--border)'}`,
            opacity: msg.is_read || type === 'sent' ? 0.85 : 1
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                {!msg.is_read && type === 'inbox' && (
                  <span className="badge" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem' }}>New</span>
                )}
                <strong style={{ fontSize: '0.95rem' }}>{msg.subject}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {type === 'inbox' ? `From: ${msg.sender?.username || msg.sender_name || 'Unknown'}` : `To: ${msg.receiver?.username || msg.receiver_name || 'Unknown'}`}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
            </div>
          </div>
          {msg._open && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
              {msg.body}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Messages() {
  const [tab, setTab] = useState('inbox')
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const [inRes, sentRes] = await Promise.all([
          api.get('/api/messages/inbox/'),
          api.get('/api/messages/sent/')
        ])
        setInbox(Array.isArray(inRes.data) ? inRes.data : (inRes.data.results || []))
        setSent(Array.isArray(sentRes.data) ? sentRes.data : (sentRes.data.results || []))
      } catch {
        setError('Failed to load messages.')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const handleOpen = async (msg) => {
    if (tab === 'inbox') {
      setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, _open: !m._open } : m))
      if (!msg.is_read && tab === 'inbox') {
        try {
          await api.post(`/api/messages/${msg.id}/read/`)
          setInbox(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
        } catch { /* ignore */ }
      }
    } else {
      setSent(prev => prev.map(m => m.id === msg.id ? { ...m, _open: !m._open } : m))
    }
  }

  const current = tab === 'inbox' ? inbox : sent

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <style>{`
        .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 1.5rem; }
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
        .tab-btn:hover { color: var(--text); }
      `}</style>

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>Messages</h1>

      <div className="tabs">
        <button className={`tab-btn${tab === 'inbox' ? ' active' : ''}`} onClick={() => setTab('inbox')}>
          Inbox {inbox.filter(m => !m.is_read).length > 0 && `(${inbox.filter(m => !m.is_read).length})`}
        </button>
        <button className={`tab-btn${tab === 'sent' ? ' active' : ''}`} onClick={() => setTab('sent')}>
          Sent
        </button>
      </div>

      {loading && <div className="loading-spinner">Loading messages...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && <MessageList messages={current} onOpen={handleOpen} type={tab} />}
    </div>
  )
}
