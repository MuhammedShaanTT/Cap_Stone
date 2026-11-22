import React, { useState } from 'react';
import './Hero.css';

export default function Hero({ onOpenConsole }) {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid', 'heal', 'sec', 'pipeline'

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Value Proposition */}
        <div className="hero-content">
          <div>
            <div className="pill-badge">
              <span className="pulse-dot"></span>
              New: Autonomous Self-Healing Engine v3.4 Launched
            </div>
          </div>

          <h1 className="display-1 hero-headline">
            Autonomous Mobile Testing & AI AppSec at <span className="highlight">Enterprise Scale</span>.
          </h1>

          <p className="subheading">
            Eliminate flaky tests, prevent zero-day mobile vulnerabilities, and ship 4.2x faster.
            Aura Quality Cloud autonomously analyzes APK/IPA builds, generates test suites, and
            heals broken locators in real time.
          </p>

          <div className="hero-ctas">
            <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce">
              Start Free Enterprise Trial &rarr;
            </button>
            <button onClick={() => onOpenConsole('defect-test')} className="btn btn-outline">
              🔍 Run Automated Defect Scan
            </button>
          </div>

          <div className="hero-trust-row">
            <div className="hero-trust-item">
              <span style={{ color: 'var(--emerald-accent)' }}>✓</span> SOC 2 Type II
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--emerald-accent)' }}>✓</span> OWASP MASVS Audited
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--emerald-accent)' }}>✓</span> 99.98% SLA
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--emerald-accent)' }}>✓</span> Pure In-Memory DB
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Product Dashboard Mockup */}
        <div className="preview-shell">
          <div className="preview-topbar">
            <div className="preview-dots">
              <div className="preview-dot" style={{ background: '#ef4444' }}></div>
              <div className="preview-dot" style={{ background: '#f59e0b' }}></div>
              <div className="preview-dot" style={{ background: '#10b981' }}></div>
            </div>

            <div className="preview-tab-row">
              <button
                className={`preview-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveTab('grid')}
              >
                ● Live Grid
              </button>
              <button
                className={`preview-tab-btn ${activeTab === 'heal' ? 'active' : ''}`}
                onClick={() => setActiveTab('heal')}
              >
                ⚡ Self-Healing
              </button>
              <button
                className={`preview-tab-btn ${activeTab === 'sec' ? 'active' : ''}`}
                onClick={() => setActiveTab('sec')}
              >
                🛡️ AppSec (CWE)
              </button>
              <button
                className={`preview-tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('pipeline')}
              >
                🔄 Telemetry
              </button>
            </div>
          </div>

          <div className="preview-body">
            {activeTab === 'grid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Active Suite: <strong style={{ color: '#fff' }}>smoke-regression-v2.0</strong>
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    ● 14 Parallel Devices Active
                  </span>
                </div>

                <div style={{
                  background: '#0a0f1d',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  border: '1px solid #1e293b',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#60a5fa' }}>Google Pixel 8 Pro [Android 14]</span>
                    <span style={{ color: '#34d399' }}>PASSED (1.8s)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#60a5fa' }}>Samsung Galaxy S24 Ultra [OneUI 6]</span>
                    <span style={{ color: '#34d399' }}>PASSED (2.1s)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#60a5fa' }}>Apple iPhone 15 Pro Max [iOS 17.4]</span>
                    <span style={{ color: '#fbbf24' }}>HEALING IN PROGRESS...</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pass Rate</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>98.4%</div>
                  </div>
                  <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Avg Latency</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>1.9s</div>
                  </div>
                  <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Auto-Healed</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#eb144c' }}>12 Suites</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'heal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⚠️</span> Broken Locator Detected: <code style={{ color: '#fff' }}>By.id("btn_login_submit")</code>
                </div>
                <div style={{
                  background: '#0a0f1d',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  border: '1px solid #1e293b'
                }}>
                  <div style={{ color: '#ef4444' }}>- By.id("btn_login_submit")</div>
                  <div style={{ color: '#10b981' }}>+ By.id("btn_submit_login_v2") // AI Confidence: 95%</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Hypothesis: App redesign renamed submit button id. Automated PR patch generated.
                </div>
              </div>
            )}

            {activeTab === 'sec' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f87171' }}>
                    ● 5 Automated SAST Vulnerabilities Found
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Target: defect-test-app.apk</span>
                </div>
                <div style={{
                  background: '#0a0f1d',
                  borderRadius: '6px',
                  padding: '0.7rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ color: '#ef4444' }}>[CRITICAL] CWE-798: Hardcoded Google API Key in Bytecode</div>
                  <div style={{ color: '#f97316' }}>[HIGH] CWE-319: Cleartext HTTP Traffic Permitted</div>
                  <div style={{ color: '#f97316' }}>[HIGH] CWE-489: android:debuggable="true" in Release</div>
                  <div style={{ color: '#fbbf24' }}>[MEDIUM] CWE-328: Weak Cryptographic MD5 Hash Used</div>
                  <div style={{ color: '#fbbf24' }}>[MEDIUM] CWE-926: Exported Activity Missing Permission</div>
                </div>
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  CI/CD Run <strong style={{ color: '#fff' }}>#PR-14892</strong> on branch <code style={{ color: '#60a5fa' }}>main</code>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '6px', background: '#10b981', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#10b981', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#10b981', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#eb144c', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Quality Gate: <strong>HOLD</strong> (High Risk SAST Vulnerability CWE-798 requires patch before release).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
