import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { qualityService } from '../services/qualityService';
import { useToast } from '../context/ToastContext';
import { useProject } from '../context/ProjectContext';
import './ProjectDashboardPage.css';

export default function ProjectDashboardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { activeProject } = useProject();
  const { notifySuccess, notifyError, notifyInfo } = useToast();

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  const loadDashboardData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await projectService.getDashboard(projectId);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      if (!err.message?.includes('401') && !err.message?.includes('403')) {
        notifyError(err.message || 'Could not fetch dashboard metrics');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, notifyError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    notifyInfo('Executing SAST static bytecode scanner & invoking Gemini 2.5 AI...', 'Analysis Started');
    try {
      const res = await qualityService.runQualityAnalysis(projectId);
      setLatestAnalysis(res);
      notifySuccess('Analysis complete! Verdict & remediation ready.', 'Analysis Complete');
      await loadDashboardData();
    } catch (err) {
      notifyError(err.message || 'Failed to complete analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const verCount = metrics?.appVersionCount ?? metrics?.totalAppVersions ?? 0;
  const testCount = metrics?.testCaseCount ?? metrics?.totalTestCases ?? 0;
  const scanCount = metrics?.securityScanCount ?? metrics?.totalSecurityScans ?? 0;

  // Determine current posture verdict
  const verdict = latestAnalysis?.recommendation || (scanCount > 0 ? 'NEEDS REVIEW' : 'AWAITING SCAN');
  const isHold = verdict === 'HOLD';
  const isApproved = verdict === 'APPROVED';

  return (
    <div className="meta-dashboard">
      {/* 1. Header & Security Posture Verdict Banner */}
      <div className="meta-posture-banner">
        <div className="meta-posture-left">
          <div className="meta-posture-status-icon">
            {isHold ? '🚨' : isApproved ? '🛡️' : '⚖️'}
          </div>
          <div>
            <div className="meta-posture-badge-row">
              <span className={`pill ${isHold ? 'pill-threat' : isApproved ? 'pill-clean' : 'pill-warning'}`}>
                RELEASE GATE: {verdict}
              </span>
              <span className="pill pill-info">TARGET: {activeProject?.name || projectId}</span>
            </div>
            <h1 className="meta-posture-heading">
              {isHold
                ? 'High Risk Defect Detected — Deployment on Hold'
                : isApproved
                ? 'All Quality & Security Gates Cleared for Release'
                : 'Continuous Security & Autonomous Quality Dashboard'}
            </h1>
            <p className="meta-posture-sub">
              {isHold
                ? 'Vulnerabilities or test failures violate release policy. Review AI diagnosis and self-healing proposals below.'
                : 'Real-time telemetry from SAST bytecode scanner, Appium locator engine, and Gemini 2.5 Flash.'}
            </p>
          </div>
        </div>

        <div className="meta-posture-actions">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="btn btn-primary"
          >
            {analyzing ? '⚡ Running Analysis...' : '⚡ Run Quality Analysis Now'}
          </button>
          <button
            onClick={() => navigate(`/app/projects/${projectId}/versions`)}
            className="btn btn-secondary"
          >
            📦 Drop In APK File
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Widgets Row */}
      <div className="meta-metrics-grid">
        <div className="meta-metric-card">
          <div className="meta-metric-top">
            <span className="meta-metric-label">APP BINARIES</span>
            <span className="meta-metric-icon">📦</span>
          </div>
          <div className="meta-metric-val">{loading ? '-' : verCount}</div>
          <div className="meta-metric-footer">
            <Link to={`/app/projects/${projectId}/versions`}>Manage versions &rarr;</Link>
          </div>
        </div>

        <div className="meta-metric-card">
          <div className="meta-metric-top">
            <span className="meta-metric-label">SYNTHESIZED TEST CASES</span>
            <span className="meta-metric-icon">🧪</span>
          </div>
          <div className="meta-metric-val">{loading ? '-' : testCount}</div>
          <div className="meta-metric-footer">
            <Link to={`/app/projects/${projectId}/test-cases`}>View AI test cases &rarr;</Link>
          </div>
        </div>

        <div className="meta-metric-card">
          <div className="meta-metric-top">
            <span className="meta-metric-label">SECURITY SCANS</span>
            <span className="meta-metric-icon">🛡️</span>
          </div>
          <div className="meta-metric-val">{loading ? '-' : scanCount}</div>
          <div className="meta-metric-footer">
            <Link to={`/app/projects/${projectId}/scans`}>Scan history &rarr;</Link>
          </div>
        </div>

        <div className="meta-metric-card">
          <div className="meta-metric-top">
            <span className="meta-metric-label">RISK FACTOR EVALUATION</span>
            <span className="meta-metric-icon">📊</span>
          </div>
          <div className="meta-metric-val" style={{ color: latestAnalysis ? (isHold ? '#ff3366' : '#00e676') : '#cbd5e1' }}>
            {latestAnalysis ? `${(latestAnalysis.riskScore * 100).toFixed(0)}%` : '0%'}
          </div>
          <div className="meta-metric-footer">
            <Link to={`/app/projects/${projectId}/findings`}>Inspect CWE findings &rarr;</Link>
          </div>
        </div>
      </div>

      {/* 3. Latest AI Executive Quality Assessment (if available) */}
      {latestAnalysis && latestAnalysis.aiQualitySummary && (
        <div className="meta-ai-assessment-card">
          <div className="meta-ai-card-header">
            <div className="meta-ai-header-left">
              <span className="meta-ai-sparkle">🧠</span>
              <div>
                <h3 className="meta-ai-title">Gemini 2.5 Flash Autonomous Executive Assessment</h3>
                <div className="meta-ai-sub">Generated from automated bytecode scanning & defect classification</div>
              </div>
            </div>
            <span className="pill pill-clean">AI INTEGRATED</span>
          </div>
          <div className="meta-ai-content">
            {latestAnalysis.aiQualitySummary}
          </div>
        </div>
      )}

      {/* 4. Dual Section: Security Findings + Self-Healing Proposal */}
      <div className="meta-dashboard-dual">
        {/* Left: Security Defects */}
        <div className="meta-widget-box">
          <div className="meta-widget-header">
            <div className="meta-widget-title">
              <span>🛡️</span> Detected Security Defect Findings
            </div>
            <Link to={`/app/projects/${projectId}/findings`} className="btn btn-outline btn-sm">
              All Findings &rarr;
            </Link>
          </div>

          {latestAnalysis?.securityFindings && latestAnalysis.securityFindings.length > 0 ? (
            <div className="meta-findings-list">
              {latestAnalysis.securityFindings.slice(0, 4).map((f) => (
                <div key={f.id} className={`meta-finding-item severity-${f.severity}`}>
                  <div className="meta-finding-head">
                    <strong className="meta-finding-title">{f.title}</strong>
                    <span className={`pill ${f.severity === 'CRITICAL' ? 'pill-threat' : 'pill-warning'}`}>
                      {f.severity}
                    </span>
                  </div>
                  <div className="meta-finding-loc code-font">
                    {f.location} | CWE-{f.cweId}
                  </div>
                  <div className="meta-finding-remed">
                    <strong>Remediation:</strong> {f.remediation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="meta-widget-empty">
              <p>No active findings detected. Click "Run Quality Analysis Now" to audit the mobile binary.</p>
            </div>
          )}
        </div>

        {/* Right: AI Self-Healing Locators */}
        <div className="meta-widget-box">
          <div className="meta-widget-header">
            <div className="meta-widget-title">
              <span>⚡</span> AI Self-Healing Locator Engine
            </div>
            <Link to={`/app/projects/${projectId}/healing`} className="btn btn-outline btn-sm">
              Healing Center &rarr;
            </Link>
          </div>

          {latestAnalysis?.healingProposal ? (
            <div className="meta-healing-preview">
              <div className="meta-healing-meta">
                <span className="pill pill-clean">
                  Confidence: {(latestAnalysis.healingProposal.confidence * 100).toFixed(0)}%
                </span>
                <span className="meta-healing-date">Target: Appium Driver</span>
              </div>
              <div className="meta-healing-hypo">
                <strong>Failure Hypothesis:</strong> {latestAnalysis.failureAnalysis?.hypothesis || 'UI element identifier renamed in updated APK version.'}
              </div>
              <div className="meta-diff-box code-font">
                <div className="meta-diff-line-head">// Proposed Locator Patch Diff:</div>
                <pre>{latestAnalysis.healingProposal.patchDiff}</pre>
              </div>
            </div>
          ) : (
            <div className="meta-widget-empty">
              <p>Self-healing locators will automatically synthesize here when an Appium test failure or UI layout change is detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
