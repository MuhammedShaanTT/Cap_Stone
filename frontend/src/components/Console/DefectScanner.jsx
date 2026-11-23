import React, { useState } from 'react';
import { qualityService } from '../../services/qualityService';

export default function DefectScanner({ projectId, onScanComplete }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunScan = async () => {
    if (!projectId) {
      alert('Please select a project first.');
      return;
    }
    setScanning(true);
    setError(null);
    try {
      const data = await qualityService.runQualityAnalysis(projectId);
      setResult(data);
      if (onScanComplete) onScanComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="console-card">
      <div className="console-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🔍 Automated Quality & Defect Analysis</span>
        <span style={{
          fontSize: '0.7rem',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(235,20,76,0.2))',
          color: '#38bdf8',
          border: '1px solid rgba(56,189,248,0.4)',
          padding: '2px 8px',
          borderRadius: '12px',
          fontWeight: 600
        }}>
          Prototype analysis
        </span>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Runs the current MVP quality-analysis workflow and presents generated findings, summaries, and proposed remediation.
        Real scanner execution and device-based tests are planned for a later phase.
      </p>

      <button
        onClick={handleRunScan}
        disabled={scanning}
        className="btn btn-sauce"
        style={{ width: '100%' }}
      >
        {scanning ? '⚡ Generating analysis...' : '⚡ Run automated defect analysis'}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1.25rem' }}>
          {/* Executive Gemini AI Summary Card */}
          {result.aiQualitySummary && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>✨</span>
                <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>AI-assisted quality assessment:</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                {result.aiQualitySummary}
              </div>
            </div>
          )}

          {/* Analysis Gate & Risk Summary */}
          <div style={{
            background: '#0a0f1d',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Release Gate: <span style={{ color: result.recommendation === 'HOLD' ? '#ef4444' : '#10b981', fontWeight: 800 }}>{result.recommendation}</span>
              </span>
              <span style={{
                fontSize: '0.75rem',
                background: result.riskLevel === 'HIGH' ? '#7f1d1d' : '#065f46',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700
              }}>
                RISK: {result.riskLevel} ({(result.riskScore * 100).toFixed(0)}%)
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Scan ID: <code className="code-inline">{result.scanId}</code> | Target Version: <code className="code-inline">{result.appVersionId}</code>
            </div>
          </div>

          {/* AI Self-Healing Section */}
          {result.healingProposal && (
            <div style={{ background: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                  ⚡ AI Self-Healing Locator Proposal
                </div>
                <span style={{ fontSize: '0.72rem', background: '#854d0e', color: '#fde68a', padding: '2px 6px', borderRadius: '4px' }}>
                  {(result.healingProposal.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.6rem' }}>
                <strong>Hypothesis:</strong> {result.failureAnalysis?.hypothesis}
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                background: '#020617',
                padding: '0.75rem',
                borderRadius: '4px',
                color: '#34d399',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
                {result.healingProposal.patchDiff}
              </pre>
            </div>
          )}

          {/* Security Findings List */}
          {result.securityFindings && result.securityFindings.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Detected Security Defect Findings ({result.securityFindings.length})</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Generated MVP findings</span>
              </div>
              <div className="findings-list">
                {result.securityFindings.map(f => {
                  const isGemini = f.remediation && f.remediation.includes('✨ [Gemini');
                  return (
                    <div key={f.id} className="finding-item" style={{ borderLeft: f.severity === 'CRITICAL' ? '3px solid #ef4444' : f.severity === 'HIGH' ? '3px solid #f97316' : '3px solid #f59e0b' }}>
                      <div className="finding-header">
                        <strong style={{ color: '#fff' }}>{f.title}</strong>
                        <span className={`severity-pill severity-${f.severity}`}>{f.severity}</span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                        Location: <code style={{ color: '#60a5fa' }}>{f.location}</code> | CWE: <strong>{f.cweId}</strong>
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                        {f.description}
                      </div>
                      <div style={{
                        color: isGemini ? '#67e8f9' : '#34d399',
                        fontSize: '0.75rem',
                        background: isGemini ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        border: isGemini ? '1px solid rgba(6, 182, 212, 0.25)' : 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        lineHeight: 1.5
                      }}>
                        <strong>{isGemini ? '✨ Gemini AI Suggestion:' : '💡 Recommended Remediation:'}</strong> {isGemini ? f.remediation.replace('✨ [Gemini AI Recommendation] ', '') : f.remediation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
