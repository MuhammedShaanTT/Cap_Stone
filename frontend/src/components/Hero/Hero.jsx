import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('grid');
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Value Proposition */}
        <div className="hero-content">
          <div>
            <div className="pill-badge">
              <span className="pulse-dot"></span>
              MetaDefender Mobile Quality Platform (MVP Prototype)
            </div>
          </div>

          <h1 className="display-1 hero-headline">
            AI-Driven Autonomous Mobile Quality & <span className="highlight">AppSec Intelligence</span>.
          </h1>

          <p className="subheading">
            Zero-trust mobile vulnerability scanning, automated Appium test synthesis with Google Gemini 2.5 Flash,
            and self-healing locators that repair broken selectors in CI/CD.
          </p>

          <div className="hero-ctas">
            <Link to="/app/projects" className="btn btn-primary btn-lg">
              ⚡ Launch Live Platform &rarr;
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              🔑 Sign In to Console
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="hero-trust-item">
              <span style={{ color: 'var(--verdict-clean)' }}>✓</span> Spring Boot 3.4
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--verdict-clean)' }}>✓</span> Google Gemini 2.5 Flash
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--verdict-clean)' }}>✓</span> OWASP CWE Scanners
            </div>
            <div className="hero-trust-item">
              <span style={{ color: 'var(--verdict-clean)' }}>✓</span> In-Memory MongoDB
            </div>
          </div>
        </div>

        {/* Right Column: MetaDefender-Inspired Interactive Scanner Preview */}
        <div className="preview-shell">
          <div className="preview-topbar">
            <div className="preview-dots">
              <div className="preview-dot" style={{ background: '#ff3366' }}></div>
              <div className="preview-dot" style={{ background: '#ffaa00' }}></div>
              <div className="preview-dot" style={{ background: '#00e676' }}></div>
            </div>

            <div className="preview-tab-row">
              <button
                className={`preview-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveTab('grid')}
              >
                ● Multiscan
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
                🔄 Release Gate
              </button>
            </div>
          </div>

          <div className="preview-body">
            {activeTab === 'grid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Analyzed Binary: <strong style={{ color: '#fff' }}>defect-test-app.apk</strong>
                  </span>
                  <span className="pill pill-clean">
                    ● Prototype Multi-Scan Ready
                  </span>
                </div>

                <div style={{
                  background: '#070d18',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  border: '1px solid #1b2a4a',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#38bdf8' }}>Google Pixel 8 Emulator [Android 14]</span>
                    <span style={{ color: 'var(--verdict-clean)' }}>PASSED (1.8s)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#38bdf8' }}>Samsung Galaxy S24 [Android 14]</span>
                    <span style={{ color: 'var(--verdict-clean)' }}>PASSED (2.1s)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#38bdf8' }}>AI Locator Repair Intercept</span>
                    <span style={{ color: 'var(--verdict-warning)' }}>REPAIRED (95% CONFIDENCE)</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  <div style={{ background: '#111b30', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#889bb8' }}>Verdict</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ff3366' }}>HOLD</div>
                  </div>
                  <div style={{ background: '#111b30', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#889bb8' }}>Risk Score</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffaa00' }}>85%</div>
                  </div>
                  <div style={{ background: '#111b30', padding: '0.6rem', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#889bb8' }}>Gemini Model</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00d2ff' }}>2.5 Flash</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'heal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#ffaa00', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⚠️</span> Broken Locator Detected: <code style={{ color: '#fff' }}>By.id("btn_login_submit")</code>
                </div>
                <div style={{
                  background: '#070d18',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  border: '1px solid #1b2a4a'
                }}>
                  <div style={{ color: '#ff3366' }}>- driver.findElement(By.id("btn_login_submit")).click();</div>
                  <div style={{ color: '#00e676' }}>+ driver.findElement(By.id("btn_submit_login_v2")).click(); // AI Confidence: 95%</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#889bb8' }}>
                  Hypothesis: UI developer renamed submit button ID. Automated Git PR patch diff generated.
                </div>
              </div>
            )}

            {activeTab === 'sec' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff3366' }}>
                    ● 5 Automated SAST Vulnerabilities Found
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#889bb8' }}>Target: defect-test-app.apk</span>
                </div>
                <div style={{
                  background: '#070d18',
                  borderRadius: '6px',
                  padding: '0.7rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ color: '#ff3366' }}>[CRITICAL] CWE-798: Hardcoded Google API Secret in Bytecode</div>
                  <div style={{ color: '#f97316' }}>[HIGH] CWE-319: Cleartext HTTP Traffic Permitted</div>
                  <div style={{ color: '#f97316' }}>[HIGH] CWE-489: android:debuggable="true" in Release</div>
                  <div style={{ color: '#ffaa00' }}>[MEDIUM] CWE-328: Weak Cryptographic MD5 Hash Used</div>
                  <div style={{ color: '#ffaa00' }}>[MEDIUM] CWE-926: Exported Activity Missing Permission</div>
                </div>
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#889bb8' }}>
                  CI/CD Build Quality Gate on branch <code style={{ color: '#00d2ff' }}>feature/frontend-overhaul</code>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '6px', background: '#00e676', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#00e676', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#00e676', borderRadius: '3px' }}></div>
                  <div style={{ flex: 1, height: '6px', background: '#ff3366', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Quality Gate: <strong>HOLD</strong> (Critical SAST CWE-798 must be patched before production deployment).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
