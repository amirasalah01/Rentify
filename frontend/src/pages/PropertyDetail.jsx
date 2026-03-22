import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function StarSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', fontSize: '1.5rem', cursor: 'pointer' }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange(n)} style={{ color: n <= value ? '#f59e0b' : '#e2e8f0' }}>★</span>
      ))}
    </div>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')
  const [msgForm, setMsgForm] = useState({ subject: '', body: '' })
  const [msgError, setMsgError] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/api/properties/${id}/`),
      api.get(`/api/properties/${id}/reviews/`)
    ]).then(([propRes, revRes]) => {
      setProperty(propRes.data)
      setReviews(Array.isArray(revRes.data) ? revRes.data : (revRes.data.results || []))
    }).catch(() => setError('Failed to load property.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleFavorite = async () => {
    if (!property) return
    try {
      if (property.is_favorite) {
        await api.delete(`/api/properties/favorite/${id}/`)
      } else {
        await api.post('/api/properties/favorites/', { property: id })
      }
      setProperty(p => ({ ...p, is_favorite: !p.is_favorite }))
    } catch { /* ignore */ }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    setReviewError('')
    setReviewSuccess('')
    try {
      const res = await api.post(`/api/properties/${id}/reviews/`, reviewForm)
      setReviews(prev => [res.data, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      setReviewSuccess('Review submitted!')
    } catch (err) {
      setReviewError(err.response?.data?.detail || 'Failed to submit review.')
    }
  }

  const handleMessage = async (e) => {
    e.preventDefault()
    setMsgError('')
    setMsgSuccess('')
    try {
      await api.post('/api/messages/send/', { ...msgForm, property: id })
      setMsgForm({ subject: '', body: '' })
      setMsgSuccess('Message sent to landlord!')
    } catch (err) {
      setMsgError(err.response?.data?.detail || 'Failed to send message.')
    }
  }

  if (loading) return <div className="loading-spinner container" style={{ paddingTop: '3rem' }}>Loading...</div>
  if (error) return <div className="error-message container" style={{ paddingTop: '3rem' }}>{error}</div>
  if (!property) return null

  return (
    <div>
      <style>{`
        .property-hero {
          background: linear-gradient(135deg, #2563eb33, #f59e0b22);
          padding: 3rem 1.5rem;
          text-align: center;
          font-size: 4rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 480px) {
          .property-hero { font-size: 3rem; padding: 2rem 1rem; }
        }
        .property-detail-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 768px) { .property-detail-grid { grid-template-columns: 1fr; } }
        .detail-section { margin-bottom: 2rem; }
        .detail-section h2 { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text); }
        .detail-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
        .detail-meta-item { background: var(--bg); border-radius: 8px; padding: 0.75rem 1rem; }
        .detail-meta-item .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-meta-item .value { font-size: 1rem; font-weight: 600; color: var(--text); margin-top: 2px; }
        .review-item { border-bottom: 1px solid var(--border); padding: 1rem 0; }
        .review-item:last-child { border-bottom: none; }
        .review-stars { color: #f59e0b; }
        .review-author { font-weight: 600; font-size: 0.9rem; }
        .review-date { font-size: 0.8rem; color: var(--text-muted); }
      `}</style>

      <div className="property-hero">
        {property.property_type === 'apartment' ? '🏢' :
         property.property_type === 'house' ? '🏡' :
         property.property_type === 'villa' ? '🏰' :
         property.property_type === 'condo' ? '🏙️' : '🏠'}
      </div>

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div className="property-detail-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge" style={{ marginBottom: '0.5rem' }}>{property.property_type}</span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{property.title}</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>📍 {property.address}, {property.city}, {property.country}</p>
              </div>
              {isAuthenticated && (
                <button className="btn btn-outline" onClick={handleFavorite} style={{ flexShrink: 0 }}>
                  {property.is_favorite ? '❤️ Saved' : '🤍 Save'}
                </button>
              )}
            </div>

            <div className="detail-meta">
              <div className="detail-meta-item">
                <div className="label">Price</div>
                <div className="value" style={{ color: 'var(--primary)' }}>${Number(property.price_per_month).toLocaleString()}/mo</div>
              </div>
              <div className="detail-meta-item">
                <div className="label">Bedrooms</div>
                <div className="value">🛏 {property.bedrooms}</div>
              </div>
              <div className="detail-meta-item">
                <div className="label">Bathrooms</div>
                <div className="value">🚿 {property.bathrooms}</div>
              </div>
              {property.square_feet && (
                <div className="detail-meta-item">
                  <div className="label">Size</div>
                  <div className="value">📐 {property.square_feet} sqft</div>
                </div>
              )}
              <div className="detail-meta-item">
                <div className="label">Available From</div>
                <div className="value">📅 {property.available_from}</div>
              </div>
              <div className="detail-meta-item">
                <div className="label">Views</div>
                <div className="value">👁 {property.view_count || 0}</div>
              </div>
              <div className="detail-meta-item">
                <div className="label">Rating</div>
                <div className="value">⭐ {property.average_rating ? Number(property.average_rating).toFixed(1) : 'N/A'}</div>
              </div>
              <div className="detail-meta-item">
                <div className="label">Status</div>
                <div className="value" style={{ color: property.is_available ? 'var(--success)' : 'var(--error)' }}>
                  {property.is_available ? '✓ Available' : '✗ Not Available'}
                </div>
              </div>
            </div>

            {property.description && (
              <div className="detail-section">
                <h2>Description</h2>
                <p style={{ color: 'var(--text)', lineHeight: 1.7 }}>{property.description}</p>
              </div>
            )}

            <div className="detail-section">
              <h2>Reviews ({reviews.length})</h2>
              {reviews.length === 0
                ? <div className="empty-state"><p>No reviews yet.</p></div>
                : reviews.map((r, i) => (
                    <div className="review-item" key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span className="review-author">{r.user?.username || r.reviewer || 'Anonymous'}</span>
                        <span className="review-date">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      {r.comment && <p style={{ marginTop: '0.5rem', color: 'var(--text)', fontSize: '0.9rem' }}>{r.comment}</p>}
                    </div>
                  ))
              }
            </div>

            {isAuthenticated && (
              <div className="card detail-section" style={{ padding: '1.5rem' }}>
                <h2>Leave a Review</h2>
                {reviewError && <div className="form-error" style={{ marginBottom: '1rem' }}>{reviewError}</div>}
                {reviewSuccess && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{reviewSuccess}</div>}
                <form onSubmit={handleReview}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <StarSelector value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea className="form-textarea" rows={3} value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" type="submit">Submit Review</button>
                </form>
              </div>
            )}
          </div>

          <div>
            {isAuthenticated && (
              <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Landlord</h2>
                {msgError && <div className="form-error" style={{ marginBottom: '1rem' }}>{msgError}</div>}
                {msgSuccess && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{msgSuccess}</div>}
                <form onSubmit={handleMessage}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" required value={msgForm.subject}
                      onChange={e => setMsgForm(f => ({ ...f, subject: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" rows={4} required value={msgForm.body}
                      onChange={e => setMsgForm(f => ({ ...f, body: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Send Message</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
