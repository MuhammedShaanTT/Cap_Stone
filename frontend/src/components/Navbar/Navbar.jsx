import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ onOpenConsole }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#" className="brand-logo">
          <div className="brand-icon">
            <span>▲</span>
          </div>
          <span>AURA<span className="brand-accent">.</span>QA</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-menu">
            {/* Products Dropdown */}
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Products <span className="caret">▼</span>
              </a>
              <div className="mega-menu">
                <div className="mega-grid">
                  <a href="#features" className="mega-item">
                    <div className="mega-item-icon">⚡</div>
                    <div>
                      <div className="mega-item-title">Autonomous AI Engine</div>
                      <div className="mega-item-desc">Self-healing test cases & auto-generated mobile suites.</div>
                    </div>
                  </a>
                  <a href="#features" className="mega-item">
                    <div className="mega-item-icon">🛡️</div>
                    <div>
                      <div className="mega-item-title">Continuous Mobile AppSec</div>
                      <div className="mega-item-desc">Automated SAST & CWE vulnerability detection in CI.</div>
                    </div>
                  </a>
                  <a href="#architecture" className="mega-item">
                    <div className="mega-item-icon">📱</div>
                    <div>
                      <div className="mega-item-title">Real-Device Cloud</div>
                      <div className="mega-item-desc">Thousands of physical iOS & Android test matrices.</div>
                    </div>
                  </a>
                  <a href="#integrations" className="mega-item">
                    <div className="mega-item-icon">🔄</div>
                    <div>
                      <div className="mega-item-title">CI/CD Gateways</div>
                      <div className="mega-item-desc">Native pipelines for GitHub Actions, GitLab & Jenkins.</div>
                    </div>
                  </a>
                </div>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="nav-item">
              <a className="nav-link" href="#architecture">
                Solutions <span className="caret">▼</span>
              </a>
              <div className="mega-menu" style={{ minWidth: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="#architecture" className="mega-item">
                    <div className="mega-item-icon">🏦</div>
                    <div>
                      <div className="mega-item-title">Enterprise FinTech</div>
                      <div className="mega-item-desc">Bank-grade OWASP MASVS security compliance.</div>
                    </div>
                  </a>
                  <a href="#architecture" className="mega-item">
                    <div className="mega-item-icon">🛍️</div>
                    <div>
                      <div className="mega-item-title">High-Velocity Retail & E-Commerce</div>
                      <div className="mega-item-desc">Zero flakiness during critical release windows.</div>
                    </div>
                  </a>
                </div>
              </div>
            </li>

            {/* Platform Dropdown */}
            <li className="nav-item">
              <a className="nav-link" href="#architecture">Platform</a>
            </li>

            {/* Integrations */}
            <li className="nav-item">
              <a className="nav-link" href="#integrations">Integrations</a>
            </li>

            {/* Resources / Docs */}
            <li className="nav-item">
              <a className="nav-link" href="/swagger-ui.html" target="_blank" rel="noopener noreferrer">
                Swagger API ↗
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button onClick={() => onOpenConsole('login')} className="nav-login">
            Sign In
          </button>
          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            API Docs
          </a>
          <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce btn-sm">
            ⚡ Launch Live Platform
          </button>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
