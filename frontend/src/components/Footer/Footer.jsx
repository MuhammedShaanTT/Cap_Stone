import React from 'react';
import './Footer.css';

export default function Footer({ onOpenConsole }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#" className="brand-logo" style={{ color: '#fff' }}>
              <div className="brand-icon">▲</div>
              <span>AURA<span className="brand-accent">.</span>QA</span>
            </a>
            <p>
              Autonomous enterprise mobile quality engineering platform inspired by Sauce Labs.
              AI test generation, continuous AppSec SAST auditing, and self-healing pipelines.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#10b981' }}>
                ● API Status: Operational (UP)
              </span>
            </div>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="#features">Autonomous AI Engine</a></li>
              <li><a href="#features">Mobile AppSec (CWE)</a></li>
              <li><a href="#architecture">Real-Device Cloud</a></li>
              <li><a href="#architecture">Self-Healing Locators</a></li>
              <li><a href="#integrations">CI/CD Gateways</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#architecture">FinTech & Banking</a></li>
              <li><a href="#architecture">E-Commerce & Retail</a></li>
              <li><a href="#architecture">Healthcare (HIPAA)</a></li>
              <li><a href="#architecture">Telecom & Media</a></li>
            </ul>
          </div>

          {/* Developers & Docs */}
          <div className="footer-col">
            <h4>Developers</h4>
            <ul>
              <li><a href="/swagger-ui.html" target="_blank" rel="noopener noreferrer">Swagger OpenAPI</a></li>
              <li><a href="/actuator/health" target="_blank" rel="noopener noreferrer">Actuator Health</a></li>
              <li><a href="javascript:void(0)" onClick={() => onOpenConsole('dashboard')}>Live Web Console</a></li>
              <li><a href="javascript:void(0)" onClick={() => onOpenConsole('defect-test')}>Automated Defect Test</a></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div className="footer-col">
            <h4>Compliance</h4>
            <ul>
              <li><a href="#">SOC 2 Type II</a></li>
              <li><a href="#">ISO 27001 Certified</a></li>
              <li><a href="#">OWASP MASVS</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Aura Quality Cloud Inc. All rights reserved. Inspired by Sauce Labs design standards.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Security</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Status</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Contact Sales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
