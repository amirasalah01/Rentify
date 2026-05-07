import { useState, useEffect } from 'react'
import api from '../api'
import PropertyCard from '../components/PropertyCard'
import { useAuth } from '../context/AuthContext'

const PROPERTY_TYPES = ['', 'apartment', 'house', 'studio', 'villa', 'condo']

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    city: '', property_type: '', min_price: '', max_price: '', bedrooms: ''
  })

  const fetchProperties = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))
      const res = await api.get('/api/properties/list/', { params: query })
      setProperties(Array.isArray(res.data) ? res.data : (res.data.results || []))
    } catch {
      setError('Failed to load properties.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProperties() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProperties(filters)
  }

  const handleClear = () => {
    const empty = { city: '', property_type: '', min_price: '', max_price: '', bedrooms: '' }
    setFilters(empty)
    fetchProperties()
  }

  const handleFavoriteToggle = async (property) => {
    if (!isAuthenticated) return
    try {
      if (property.is_favorite) {
        await api.delete(`/api/properties/favorite/${property.id}/`)
      } else {
        await api.post('/api/properties/favorites/', { property: property.id })
      }
      setProperties(prev => prev.map(p => p.id === property.id ? { ...p, is_favorite: !p.is_favorite } : p))
    } catch {
      // silently fail
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <style>{`
        .filters-form {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
        }
        .filters-form .form-group { margin: 0; flex: 1 1 150px; }
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) { .properties-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .properties-grid { grid-template-columns: 1fr; } }
        .results-count { color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem; }
      `}</style>
      <div className="page-header">
        <h1 className="page-title">Find Your Perfect Home</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse thousands of rental properties</p>
      </div>
      <form className="filters-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label className="form-label">City</label>
          <input className="form-input" placeholder="e.g. New York" value={filters.city}
            onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={filters.property_type}
            onChange={e => setFilters(f => ({ ...f, property_type: e.target.value }))}>
            <option value="">All types</option>
            {PROPERTY_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Min Price</label>
          <input className="form-input" type="number" placeholder="0" value={filters.min_price}
            onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Max Price</label>
          <input className="form-input" type="number" placeholder="Any" value={filters.max_price}
            onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Bedrooms</label>
          <input className="form-input" type="number" placeholder="Any" value={filters.bedrooms}
            onChange={e => setFilters(f => ({ ...f, bedrooms: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-outline" type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>

      {loading && <div className="loading-spinner">Loading properties...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <p className="results-count">{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found</p>
          {properties.length === 0
            ? <div className="empty-state"><p>No properties found. Try adjusting your filters.</p></div>
            : <div className="properties-grid">
                {properties.map(p => (
                  <PropertyCard key={p.id} property={p} onFavoriteToggle={handleFavoriteToggle} />
                ))}
              </div>
          }
        </>
      )}
    </div>
  )
}
