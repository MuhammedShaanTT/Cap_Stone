import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ onOpenConsole }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-container">
        <a href="#" className="brand-logo">
          <div className="brand-icon">
            <span>▲</span>
          </div>
          <span>AURA<span className="brand-accent">.</span>QA</span>
        </a>

        <nav className={mobileOpen ? 'main-nav main-nav-open' : 'main-nav'} aria-label="Primary navigation">
          <button className="nav-mode-button" onClick={() => onOpenConsole('dashboard', 'testing')}>Software Testing</button>
          <button className="nav-mode-button" onClick={() => onOpenConsole('dashboard', 'security')}>Cybersecurity</button>
        </nav>

        <div className="nav-actions">
          <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce btn-sm">
            Open Console
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
