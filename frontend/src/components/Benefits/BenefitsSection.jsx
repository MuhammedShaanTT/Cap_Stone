import React from 'react';
import './Benefits.css';

export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Accelerated Release Cycles',
      desc: 'Ship bi-weekly mobile releases with confidence. Parallel test execution cuts regression passes from 8 hours to under 12 minutes.',
      icon: '⚡',
      outcome: 'KEY OUTCOME: 4.2x Faster Release Velocity'
    },
    {
      title: 'Drastic Flake Reduction',
      desc: 'Smart retry logic, visual DOM matching, and network virtualization eliminate false-negative alarms on nightly runs.',
      icon: '🎯',
      outcome: 'KEY OUTCOME: 84% Reduction in Flaky Tests'
    },
    {
      title: 'Proactive AppSec Defense',
      desc: 'Catch hardcoded keys, cleartext traffic, and exported components in pull requests before hackers find them in the wild.',
      icon: '🛡️',
      outcome: 'KEY OUTCOME: 100% OWASP MASVS Coverage'
    },
    {
      title: 'Zero Maintenance Burden',
      desc: 'Autonomous self-healing locators adapt automatically when product designers restyle screens, saving hundreds of engineering hours.',
      icon: '🔧',
      outcome: 'KEY OUTCOME: Zero Manual Script Rewrites'
    }
  ];

  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-intro">
          <div className="pill-badge">Quantified Business Value</div>
          <h2 className="display-2">Engineered For Modern DevOps</h2>
          <p className="subheading">
            Measure ROI not in vanity metrics, but in developer hours saved, faster release turnarounds,
            and zero critical production regressions.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((b, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-icon-box">{b.icon}</div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-text">{b.desc}</div>
              <div className="benefit-outcome">{b.outcome}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
