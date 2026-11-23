import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    fetch('/actuator/health')
      .then((res) => {
        if (res.ok) setApiStatus('Operational (UP - Port 8080)');
        else setApiStatus('Backend Unavailable');
      })
      .catch(() => setApiStatus('MVP Offline (Localhost:8080)'));
  }, []);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ color: '#fff' }}>
              <div className="brand-icon">🛡️</div>
              <span>AURA<span className="brand-accent">.</span>QA</span>
            </Link>
            <p>
              AI-Driven Autonomous Mobile Application Testing, Vulnerability Assessment,
              and Self-Healing CI/CD Platform inspired by MetaDefender & Sauce Labs.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{
                fontSize: '0.78rem',
                background: '#111b30',
                padding: '4px 10px',
                borderRadius: '4px',
                color: apiStatus.includes('UP') ? '#00e676' : '#ffaa00',
                border: '1px solid #1b2a4a'
              }}>
                ● Core Engine: {apiStatus}
              </span>
            </div>
          </div>

          {/* Platform Console */}
          <div className="footer-col">
            <h4>Console Navigation</h4>
            <ul>
              <li><Link to="/app/projects">Central Projects Directory</Link></li>
              <li><Link to="/login">Sign In / Demo Login</Link></li>
              <li><a href="/swagger-ui.html" target="_blank" rel="noopener noreferrer">Swagger OpenAPI</a></li>
              <li><a href="/actuator/health" target="_blank" rel="noopener noreferrer">Actuator Health Status</a></li>
            </ul>
          </div>

          {/* Capabilities */}
          <div className="footer-col">
            <h4>Capabilities</h4>
            <ul>
              <li><a href="#features">Autonomous AI Test Synthesis</a></li>
              <li><a href="#features">Mobile AppSec (OWASP CWE)</a></li>
              <li><a href="#architecture">AI Self-Healing Locators</a></li>
              <li><a href="#integrations">CI/CD Release Gates</a></li>
            </ul>
          </div>

          {/* Reference & Repo */}
          <div className="footer-col">
            <h4>Project Artifacts</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/MuhammedShaanTT/Cap_Stone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository ↗
                </a>
              </li>
              <li><a href="https://metadefender.com" target="_blank" rel="noopener noreferrer">MetaDefender Inspiration ↗</a></li>
              <li><a href="https://mas.owasp.org/" target="_blank" rel="noopener noreferrer">OWASP MASVS Framework ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Aura Quality Cloud &bull; B.Tech Computer Science & Engineering Capstone Project.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/app/projects" style={{ color: '#889bb8', textDecoration: 'none' }}>Live Console</Link>
            <Link to="/login" style={{ color: '#889bb8', textDecoration: 'none' }}>Sign In</Link>
            <a href="https://github.com/MuhammedShaanTT/Cap_Stone" target="_blank" rel="noopener noreferrer" style={{ color: '#889bb8', textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
