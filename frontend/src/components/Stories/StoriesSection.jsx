import React from 'react';
import './Stories.css';

export default function StoriesSection() {
  const stories = [
    {
      industry: 'Global FinTech SuperApp',
      metric: '82%',
      metricLabel: 'Reduction in Regression Cycle Time',
      headline: 'Scaling Mobile Payments to 40M Users With Zero Flaky Deployments',
      quote: '"Aura Quality Cloud allowed our mobile engineering team to cut nightly regression cycles from 6 hours down to 40 minutes on physical devices."',
      author: 'VP of Mobile Engineering, Global NeoBank'
    },
    {
      industry: 'Enterprise E-Commerce',
      metric: '0',
      metricLabel: 'Critical Zero-Days in Production',
      headline: 'Securing Black Friday Releases With Continuous Bytecode Auditing',
      quote: '"The automated SAST checks caught a hardcoded sandbox payment key before our mobile build was pushed to the Play Store."',
      author: 'Head of Application Security, OmniShop Retail'
    },
    {
      industry: 'Telehealth & Diagnostics',
      metric: '94%',
      metricLabel: 'Auto-Remediation of Broken Locators',
      headline: 'Eliminating Test Script Maintenance Across 60+ Monthly Sprints',
      quote: '"When our mobile design team rolled out a complete design system rewrite, Aura\'s self-healing engine auto-fixed 180 broken selectors automatically."',
      author: 'Director of QA Automation, PulseCare AI'
    }
  ];

  return (
    <section className="stories-section">
      <div className="container">
        <div className="section-intro">
          <div className="pill-badge">Customer Success</div>
          <h2 className="display-2">Trusted By World-Class Teams</h2>
          <p className="subheading">
            Learn how enterprise software organizations ship mobile applications faster, safer, and with zero flakiness.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map((s, idx) => (
            <div key={idx} className="story-card">
              <div className="story-industry">{s.industry}</div>
              <div>
                <div className="story-metric">
                  {s.metric}
                  {s.metric !== '0' && <span>+</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {s.metricLabel}
                </div>
              </div>
              <div className="story-headline">{s.headline}</div>
              <div className="story-quote">{s.quote}</div>
              <div className="story-author">{s.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
