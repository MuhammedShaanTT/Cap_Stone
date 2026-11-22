import React from 'react';
import './Integrations.css';

export default function IntegrationsSection() {
  const integrations = [
    { name: 'Appium', cat: 'Testing Framework', desc: 'Native automation drivers for Android UIAutomator2 & iOS XCUITest.', icon: '📱' },
    { name: 'GitHub Actions', cat: 'CI/CD Pipeline', desc: 'Trigger quality gates and PR comments directly on pull requests.', icon: '🐙' },
    { name: 'GitLab CI', cat: 'CI/CD Pipeline', desc: 'Parallel pipeline execution matrices with auto-cancel on defects.', icon: '🦊' },
    { name: 'Jenkins', cat: 'Continuous Delivery', desc: 'Enterprise Jenkins plugin with zero-drift build distribution.', icon: '🤵' },
    { name: 'Jira Software', cat: 'Issue Tracking', desc: 'Auto-log defect tickets with attached video logs and stack traces.', icon: '📋' },
    { name: 'Slack', cat: 'Notifications', desc: 'Real-time alert dispatching when SAST security gates trigger.', icon: '💬' },
    { name: 'Datadog', cat: 'Observability', desc: 'Stream test run latency, device thermals, and memory graphs.', icon: '📊' },
    { name: 'Sentry', cat: 'Crash Reporting', desc: 'Correlate test automation crashes with production crash logs.', icon: '🚨' }
  ];

  return (
    <section id="integrations" className="integrations-section">
      <div className="container">
        <div className="section-intro">
          <div className="pill-badge">Ecosystem Compatibility</div>
          <h2 className="display-2">Integrates With Your Modern Stack</h2>
          <p className="subheading">
            Connect Aura Quality Cloud with the frameworks, version control repositories, and CI pipelines
            your developers already use daily.
          </p>
        </div>

        <div className="integrations-grid">
          {integrations.map((item, idx) => (
            <div key={idx} className="integration-card">
              <div className="integration-icon">{item.icon}</div>
              <div>
                <div className="integration-category">{item.cat}</div>
                <div className="integration-name">{item.name}</div>
              </div>
              <div className="integration-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
