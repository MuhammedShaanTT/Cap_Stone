import React from 'react';
import './TrustBar.css';

export default function TrustBar() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-heading">
          Built With Modern Enterprise & Cybersecurity Technologies
        </div>

        {/* Real Technology Badges */}
        <div className="trust-logos">
          <div className="trust-logo-item">
            <span>☕</span> SPRING BOOT 3.4
          </div>
          <div className="trust-logo-item">
            <span>⚛️</span> REACT 19 + VITE
          </div>
          <div className="trust-logo-item">
            <span>🍃</span> MONGODB
          </div>
          <div className="trust-logo-item">
            <span>🧠</span> GEMINI 2.5 FLASH
          </div>
          <div className="trust-logo-item">
            <span>🛡️</span> OWASP MASVS
          </div>
        </div>

        {/* Quantified Platform Stats */}
        <div className="trust-stats-grid">
          <div className="trust-stat-card">
            <div className="trust-stat-number">20<span>+</span></div>
            <div className="trust-stat-label">REST API Micro-Endpoints</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">100<span>%</span></div>
            <div className="trust-stat-label">SHA-256 Binary Integrity Verification</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">95<span>%</span></div>
            <div className="trust-stat-label">AI Locator Repair Confidence</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">5<span>-Phase</span></div>
            <div className="trust-stat-label">Continuous Quality Delivery Pipeline</div>
          </div>
        </div>
      </div>
    </section>
  );
}
