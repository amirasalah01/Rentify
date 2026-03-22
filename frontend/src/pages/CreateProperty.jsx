import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const PROPERTY_TYPES = ['apartment', 'house', 'studio', 'villa', 'condo']

export default function CreateProperty() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', address: '', city: '', country: '',
    bedrooms: '', bathrooms: '', square_feet: '', property_type: 'apartment',
    price_per_month: '', available_from: '', is_available: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await api.post('/api/properties/list/', form)
      navigate('/my-properties')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') setErrors(data)
      else setErrors({ non_field_errors: ['Failed to create property.'] })
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', required = true) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <input className="form-input" type={type} required={required} value={form[name]} onChange={set(name)} />
      {errors[name] && <p className="form-error">{errors[name][0]}</p>}
    </div>
  )

  return (
    <div className="container" style={{ maxWidth: 700, paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">List a Property</h1>
        <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to list your property</p>
      </div>
      {errors.non_field_errors && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>{errors.non_field_errors[0]}</div>
      )}
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          {field('title', 'Title')}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={4} value={form.description} onChange={set('description')} />
            {errors.description && <p className="form-error">{errors.description[0]}</p>}
          </div>
          {field('address', 'Address')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            {field('city', 'City')}
            {field('country', 'Country')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1rem' }}>
            {field('bedrooms', 'Bedrooms', 'number')}
            {field('bathrooms', 'Bathrooms', 'number')}
            {field('square_feet', 'Square Feet', 'number', false)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select className="form-select" value={form.property_type} onChange={set('property_type')}>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.property_type && <p className="form-error">{errors.property_type[0]}</p>}
            </div>
            {field('price_per_month', 'Price per Month ($)', 'number')}
          </div>
          {field('available_from', 'Available From', 'date')}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="is_available" checked={form.is_available} onChange={set('is_available')} style={{ width: 'auto' }} />
            <label htmlFor="is_available" className="form-label" style={{ margin: 0 }}>Available now</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Property'}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => navigate('/my-properties')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
