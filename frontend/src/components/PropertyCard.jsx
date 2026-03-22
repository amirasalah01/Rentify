import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TYPE_ICONS = {
  apartment: '🏢',
  house: '🏡',
  studio: '🏠',
  villa: '🏰',
  condo: '🏙️',
}

function StarRating({ rating }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0' }}>★</span>
    )
  }
  return <>{stars}</>
}

export default function PropertyCard({ property, onFavoriteToggle }) {
  const { isAuthenticated } = useAuth()
  const icon = TYPE_ICONS[property.property_type] || '🏠'

  return (
    <div className="card property-card">
      <style>{`
        .property-card { padding: 0; overflow: hidden; }
        .property-card-image {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background: linear-gradient(135deg, #2563eb22, #f59e0b22);
          position: relative;
        }
        .property-card-fav {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.85);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          transition: transform 0.15s;
        }
        .property-card-fav:hover { transform: scale(1.15); }
        .property-card-body { padding: 1rem; }
        .property-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          display: block;
          margin-bottom: 0.4rem;
        }
        .property-card-title:hover { color: var(--primary); }
        .property-card-location {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .property-card-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .property-card-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .property-card-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
      `}</style>
      <div className="property-card-image">
        {icon}
        {isAuthenticated && (
          <button
            className="property-card-fav"
            onClick={() => onFavoriteToggle && onFavoriteToggle(property)}
            title={property.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {property.is_favorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="property-card-body">
        <Link to={`/properties/${property.id}`} className="property-card-title">
          {property.title}
        </Link>
        <span className="badge">{property.property_type}</span>
        <p className="property-card-location">📍 {property.city}, {property.country}</p>
        <p className="property-card-price">${Number(property.price_per_month).toLocaleString()}/mo</p>
        <div className="property-card-meta">
          <span>🛏 {property.bedrooms} bed</span>
          <span>🚿 {property.bathrooms} bath</span>
          {property.square_feet && <span>📐 {property.square_feet} sqft</span>}
        </div>
        <div className="property-card-rating">
          <StarRating rating={property.average_rating || 0} />
          <span>({property.review_count || 0})</span>
        </div>
      </div>
    </div>
  )
}
