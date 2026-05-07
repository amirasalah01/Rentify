import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', username: '', email: '', password: '', password2: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await api.post('/api/auth/register/', form)
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') setErrors(data)
      else setErrors({ non_field_errors: ['Registration failed. Please try again.'] })
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
      {errors[name] && <p className="form-error">{errors[name][0]}</p>}
    </div>
  )

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>Create account</h1>
        {errors.non_field_errors && (
          <div className="form-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 8 }}>
            {errors.non_field_errors[0]}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            {field('first_name', 'First Name')}
            {field('last_name', 'Last Name')}
          </div>
          {field('username', 'Username')}
          {field('email', 'Email', 'email')}
          {field('password', 'Password', 'password')}
          {field('password2', 'Confirm Password', 'password')}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
