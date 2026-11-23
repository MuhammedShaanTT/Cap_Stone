import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="meta-site-header">
      <div className="container meta-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="meta-brand-logo">
          <div className="meta-brand-icon">
            <span>🛡️</span>
          </div>
          <div>
            <span className="meta-brand-title">AURA<span className="accent">.</span>QA</span>
            <span className="meta-brand-tag">METADEFENDER QUALITY</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="meta-nav-menu">
          <a href="#features" className="meta-nav-link">Capabilities</a>
          <a href="#architecture" className="meta-nav-link">Architecture</a>
          <a href="#integrations" className="meta-nav-link">Ecosystem</a>
          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="meta-nav-link"
          >
            OpenAPI Docs ↗
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="meta-nav-actions">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/app/projects')}
                className="btn btn-primary btn-sm"
              >
                ⚡ Open Console
              </button>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/app/projects" className="btn btn-primary btn-sm">
                ⚡ Launch Live Platform
              </Link>
            </>
          )}

          <button
            className="meta-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="meta-mobile-nav-menu">
          <a href="#features" onClick={() => setMobileOpen(false)} className="meta-mobile-link">
            Capabilities
          </a>
          <a href="#architecture" onClick={() => setMobileOpen(false)} className="meta-mobile-link">
            Architecture
          </a>
          <a href="#integrations" onClick={() => setMobileOpen(false)} className="meta-mobile-link">
            Ecosystem
          </a>
          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="meta-mobile-link"
          >
            OpenAPI Swagger ↗
          </a>
          <div className="meta-mobile-nav-divider" />
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="btn btn-outline"
            style={{ width: '100%', textAlign: 'center' }}
          >
            Sign In to Console
          </Link>
          <Link
            to="/app/projects"
            onClick={() => setMobileOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', textAlign: 'center' }}
          >
            ⚡ Launch Live Platform
          </Link>
        </div>
      )}
    </header>
  );
}
