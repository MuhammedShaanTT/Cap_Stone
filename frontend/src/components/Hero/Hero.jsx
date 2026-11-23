import React from 'react';
import './Hero.css';

export default function Hero({ onOpenConsole }) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="pill-badge">Quality engineering workspace</div>
          <h1 className="display-1 hero-headline">
            Software Testing and Cybersecurity, in one workspace.
          </h1>
          <p className="subheading">
            Review app builds, run supported analysis, view results, and prepare fixes.
            Testing and cybersecurity remain separate working areas.
          </p>
          <div className="hero-ctas">
            <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce">
              Open Software Testing
            </button>
            <button onClick={() => onOpenConsole('dashboard', 'security')} className="btn btn-outline">
              Open Cybersecurity
            </button>
          </div>
        </div>
        <div className="preview-shell">
          <div className="preview-topbar">
            <div className="preview-dots">
              <div className="preview-dot" style={{ background: '#ef4444' }}></div>
              <div className="preview-dot" style={{ background: '#f59e0b' }}></div>
              <div className="preview-dot" style={{ background: '#10b981' }}></div>
            </div>
            <div className="preview-tab-row"><span className="preview-tab-btn active">Console Preview</span></div>
          </div>
          <div className="preview-body">
            <div className="hero-console-preview">
              <div><span>Software Testing</span><strong>Versions, analysis, results</strong></div>
              <div><span>Cybersecurity</span><strong>Planned security workspace</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
