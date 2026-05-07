import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/auth/dashboard/')
      .then(res => setDashboard(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-spinner container" style={{ paddingTop: '3rem' }}>Loading...</div>

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
        .stat-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
        .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        @media (max-width: 600px) { .actions-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.first_name || user?.username}! 👋</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your account</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {dashboard && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{dashboard.total_properties ?? 0}</div>
            <div className="stat-label">Properties</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboard.total_views ?? 0}</div>
            <div className="stat-label">Total Views</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboard.average_rating ? Number(dashboard.average_rating).toFixed(1) : '—'}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dashboard.total_messages ?? 0}</div>
            <div className="stat-label">Messages</div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Profile Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {[
            ['Username', user?.username],
            ['Email', user?.email],
            ['Full Name', `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '—'],
            ['Member Since', user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: 8 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
      <div className="actions-grid">
        <Link to="/create-property" className="card" style={{ padding: '1.5rem', textDecoration: 'none', textAlign: 'center', color: 'var(--text)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</div>
          <div style={{ fontWeight: 600 }}>Add Property</div>
        </Link>
        <Link to="/my-properties" className="card" style={{ padding: '1.5rem', textDecoration: 'none', textAlign: 'center', color: 'var(--text)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏘️</div>
          <div style={{ fontWeight: 600 }}>My Properties</div>
        </Link>
        <Link to="/messages" className="card" style={{ padding: '1.5rem', textDecoration: 'none', textAlign: 'center', color: 'var(--text)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
          <div style={{ fontWeight: 600 }}>Messages</div>
        </Link>
      </div>
    </div>
  )
}
