import React from 'react';
import './Features.css';

export default function FeaturesSection({ onOpenConsole }) {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-intro">
          <div className="pill-badge">Intelligent Quality Engineering</div>
          <h2 className="display-2">Autonomous Mobile Testing Reimagined</h2>
          <p className="subheading">
            Replace fragile manual scripts with continuous AI intelligence that learns your mobile application’s DOM,
            predicts regressions, and audits for compliance.
          </p>
        </div>

        {/* Feature Row 1: Self-Healing AI (Text Left, Image Right) */}
        <div className="feature-row">
          <div className="feature-text">
            <div className="pill-badge" style={{ alignSelf: 'flex-start' }}>Self-Healing AI Engine</div>
            <h3>Never Let a Renamed Button Break Your Nightly Build</h3>
            <p className="subheading">
              Our Vision-LLM models observe test failures in real time. When an element identifier changes between
              app versions, Aura computes visual proximity, semantic intent, and heals the locator on the fly.
            </p>
            <ul className="feature-benefits-list">
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Automatic unified patch diff generated for GitHub & GitLab Pull Requests.
              </li>
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Zero script rewrites required when UI developers update layout hierarchies.
              </li>
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Self-healing confidence scoring (95%+) prevents incorrect repairs.
              </li>
            </ul>
            <div>
              <button onClick={() => onOpenConsole('defect-test')} className="btn btn-sauce btn-sm">
                See Live Self-Healing Demo &rarr;
              </button>
            </div>
          </div>

          <div className="feature-preview-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>AI Locator Repair Candidate</span>
              <span style={{ fontSize: '0.75rem', background: '#065f46', color: '#34d399', padding: '2px 8px', borderRadius: '4px' }}>
                95% CONFIDENCE
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: '#020617', padding: '1rem', borderRadius: '8px', lineHeight: 1.7 }}>
              <div style={{ color: '#94a3b8' }}>// Target: Calculator Login Button</div>
              <div style={{ color: '#ef4444' }}>- driver.findElement(By.id("btn_login_submit")).click();</div>
              <div style={{ color: '#10b981' }}>+ driver.findElement(By.id("btn_submit_login_v2")).click();</div>
              <div style={{ color: '#64748b', marginTop: '0.5rem' }}>// Visual Match: 0.98 | Semantic Score: 0.94 | Repair Status: APPROVED</div>
            </div>
          </div>
        </div>

        {/* Feature Row 2: Continuous Mobile AppSec (Image Left, Text Right) */}
        <div className="feature-row reverse">
          <div className="feature-text">
            <div className="pill-badge" style={{ alignSelf: 'flex-start' }}>Continuous Mobile AppSec</div>
            <h3>Identify OWASP Mobile Top 10 Bugs Before Reaching App Stores</h3>
            <p className="subheading">
              Every build uploaded to Aura Quality Cloud undergoes automated bytecode analysis, manifest validation,
              and cryptanalysis to catch hardcoded secrets, cleartext traffic, and exposed components.
            </p>
            <ul className="feature-benefits-list">
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Automated detection of CWE-798, CWE-319, CWE-489, CWE-328, and CWE-926.
              </li>
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Instant release risk assessment (HOLD vs APPROVE gates for CI/CD).
              </li>
              <li className="feature-benefit-item">
                <span className="check">✓</span>
                Actionable developer remediation code snippets for Android & iOS engineers.
              </li>
            </ul>
            <div>
              <button onClick={() => onOpenConsole('defect-test')} className="btn btn-dark btn-sm">
                Inspect Security Findings &rarr;
              </button>
            </div>
          </div>

          <div className="feature-preview-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f87171' }}>SAST Security Audit Results</span>
              <span style={{ fontSize: '0.75rem', background: '#7f1d1d', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px' }}>
                GATE: HOLD (5 Issues)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>CWE-798: Hardcoded API Secret</span>
                  <span style={{ fontSize: '0.7rem', color: '#ef4444', border: '1px solid #ef4444', padding: '1px 4px', borderRadius: '3px' }}>CRITICAL</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>com/example/calculator/network/ApiClient.java</div>
              </div>
              <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#f97316' }}>CWE-319: Cleartext HTTP Permitted</span>
                  <span style={{ fontSize: '0.7rem', color: '#f97316', border: '1px solid #f97316', padding: '1px 4px', borderRadius: '3px' }}>HIGH</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>AndroidManifest.xml (usesCleartextTraffic=true)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
