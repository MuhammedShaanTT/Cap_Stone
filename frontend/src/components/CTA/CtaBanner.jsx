import React from 'react';
import './CTA.css';

export default function CtaBanner({ onOpenConsole }) {
  return (
    <section className="cta-banner">
      <div className="container">
        <div
          className="pill-badge"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.2)',
            marginBottom: '1.5rem'
          }}
        >
          Instant Enterprise Deployment
        </div>

        <h2 className="display-2">Elevate Your Mobile Quality Engineering</h2>
        <p>
          Join elite mobile engineering teams who deploy faster with autonomous testing,
          continuous self-healing, and automated AppSec audits.
        </p>

        <div className="cta-actions">
          <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce">
            Launch Live Platform Now &rarr;
          </button>
          <button
            onClick={() => onOpenConsole('login')}
            className="btn btn-outline"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Sign In as Demo Admin
          </button>
        </div>
      </div>
    </section>
  );
}
