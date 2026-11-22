import React from 'react';
import './Architecture.css';

export default function ArchitectureSection({ onOpenConsole }) {
  const steps = [
    {
      num: 1,
      title: 'Build Ingestion',
      desc: 'APK/IPA binaries parsed, hashed with SHA-256, and indexed with zero configuration.'
    },
    {
      num: 2,
      title: 'Smart Generation',
      desc: 'Visual crawler builds regression paths and edge cases automatically from app views.'
    },
    {
      num: 3,
      title: 'Cloud Execution',
      desc: 'High-concurrency execution on real Android & iOS physical devices with zero emulator drift.'
    },
    {
      num: 4,
      title: 'AI Root Cause',
      desc: 'Vision models parse failure screenshots, crash logs, and DOM dumps within seconds.'
    },
    {
      num: 5,
      title: 'Auto-Remediation',
      desc: 'Healed locators and security remediations pushed as pull request commits.'
    }
  ];

  return (
    <section id="architecture" className="architecture-section">
      <div className="container">
        <div className="section-intro">
          <div className="pill-badge">Connected Quality Ecosystem</div>
          <h2 className="display-2">The Autonomous Quality Pipeline</h2>
          <p className="subheading">
            How Aura Quality Cloud synchronizes mobile builds, test executions, and AppSec audits
            into a unified continuous delivery feedback loop.
          </p>
        </div>

        <div className="arch-pipeline">
          {steps.map(s => (
            <div key={s.num} className="arch-node">
              <div className="arch-node-num">0{s.num}</div>
              <div className="arch-node-title">{s.title}</div>
              <div className="arch-node-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={() => onOpenConsole('dashboard')} className="btn btn-sauce">
            Try The Workflow In Live Console &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
