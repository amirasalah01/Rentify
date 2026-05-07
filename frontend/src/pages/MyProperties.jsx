import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import PropertyCard from '../components/PropertyCard'

export default function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/properties/my/')
      .then(res => setProperties(Array.isArray(res.data) ? res.data : (res.data.results || [])))
      .catch(() => setError('Failed to load your properties.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    try {
      await api.delete(`/api/properties/${id}/`)
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete property.')
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <style>{`
        .my-properties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) { .my-properties-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .my-properties-grid { grid-template-columns: 1fr; } }
        .property-actions { display: flex; gap: 0.5rem; padding: 0 1rem 1rem; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">My Properties</h1>
          <p style={{ color: 'var(--text-muted)' }}>{properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/create-property" className="btn btn-primary">+ Add Property</Link>
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && properties.length === 0 && (
        <div className="empty-state">
          <p>You haven't listed any properties yet.</p>
          <Link to="/create-property" className="btn btn-primary" style={{ marginTop: '1rem' }}>List your first property</Link>
        </div>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="my-properties-grid">
          {properties.map(p => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <PropertyCard property={p} />
              <div className="property-actions">
                <Link to={`/properties/${p.id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem' }}>View</Link>
                <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
