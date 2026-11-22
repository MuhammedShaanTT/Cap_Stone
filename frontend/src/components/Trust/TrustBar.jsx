import React from 'react';
import './TrustBar.css';

export default function TrustBar() {
  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-heading">
          Trusted by Engineering Leaders at High-Velocity Mobile Companies
        </div>

        {/* Enterprise Client Logos Placeholder */}
        <div className="trust-logos">
          <div className="trust-logo-item">
            <span>◈</span> GLOBAL FINTECH
          </div>
          <div className="trust-logo-item">
            <span>◼</span> FORTUNE 500 MEDIA
          </div>
          <div className="trust-logo-item">
            <span>●</span> HEALTHCARE AI
          </div>
          <div className="trust-logo-item">
            <span>◆</span> RETAIL SUPERAPP
          </div>
          <div className="trust-logo-item">
            <span>▲</span> AUTONOMOUS MOBILITY
          </div>
        </div>

        {/* Quantified Performance Stats */}
        <div className="trust-stats-grid">
          <div className="trust-stat-card">
            <div className="trust-stat-number">5.2M<span>+</span></div>
            <div className="trust-stat-label">Mobile Tests Run Daily</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">99.98<span>%</span></div>
            <div className="trust-stat-label">Real Device Cloud Uptime</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">84<span>%</span></div>
            <div className="trust-stat-label">Reduction in Flaky Failures</div>
          </div>
          <div className="trust-stat-card">
            <div className="trust-stat-number">4.2<span>x</span></div>
            <div className="trust-stat-label">Faster Release Cycle Velocity</div>
          </div>
        </div>
      </div>
    </section>
  );
}
