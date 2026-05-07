import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--surface);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 0 1.5rem;
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .navbar-brand {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navbar-links a {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.25rem 0;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .navbar-links a:hover,
        .navbar-links a.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .navbar-username {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: transform 0.2s;
        }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .navbar-menu {
            display: none;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: var(--surface);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 1rem 1.5rem;
            flex-direction: column;
            gap: 0.75rem;
          }
          .navbar-menu.open { display: flex; }
          .navbar-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .navbar-user {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">🏠 Rentify</Link>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
            <ul className="navbar-links">
              <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
              {isAuthenticated && (
                <>
                  <li><NavLink to="/my-properties" onClick={closeMenu}>My Properties</NavLink></li>
                  <li><NavLink to="/messages" onClick={closeMenu}>Messages</NavLink></li>
                  <li><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>
                </>
              )}
            </ul>
            <div className="navbar-user">
              {isAuthenticated ? (
                <>
                  <span className="navbar-username">Hi, {user?.first_name || user?.username}</span>
                  <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-outline" onClick={closeMenu}>Login</NavLink>
                  <NavLink to="/register" className="btn btn-primary" onClick={closeMenu}>Register</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
