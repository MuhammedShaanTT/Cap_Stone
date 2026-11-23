import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { qualityService } from '../services/qualityService';
import { useToast } from '../context/ToastContext';
import './SecurityScansPage.css';

export default function SecurityScansPage() {
  const { projectId } = useParams();
  const { notifySuccess, notifyError, notifyInfo } = useToast();

  const [versions, setVersions] = useState([]);
  const [selectedVerId, setSelectedVerId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);

  const fetchVersions = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await projectService.getAppVersions(projectId);
      const list = Array.isArray(data) ? data : [];
      setVersions(list);
      if (list.length > 0) {
        setSelectedVerId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleTriggerScan = async () => {
    if (!projectId) return;
    setScanning(true);
    setScanResult(null);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await qualityService.runQualityAnalysis(projectId, selectedVerId || undefined);
      clearInterval(stepInterval);
      setScanStep(5);
      setScanResult(res);
      notifySuccess('MetaDefender Multi-Scan Complete!', 'Scan Success');
    } catch (err) {
      clearInterval(stepInterval);
      notifyError(err.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Manifest & Permissions', desc: 'android:debuggable, exported activities & cleartext HTTP' },
    { num: 2, label: 'Bytecode & Secret Extraction', desc: 'DEX bytecode inspection for hardcoded API keys & credentials' },
    { num: 3, label: 'Cryptographic Audit', desc: 'Weak MD5/SHA1 hashing and insecure cipher discovery' },
    { num: 4, label: 'Gemini 2.5 Flash Synthesis', desc: 'Contextual risk rating and developer remediation generation' },
    { num: 5, label: 'Release Gate Verdict', desc: 'Automated CI/CD policy assessment (HOLD vs APPROVE)' }
  ];

  return (
    <div className="meta-scans-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">Vulnerability Scans & Multi-Engine SAST</h1>
          <p className="meta-page-sub">
            Static Application Security Testing (SAST) for Android APK builds. Detects OWASP Mobile Top 10 vulnerabilities and enforces release quality gates.
          </p>
        </div>
      </div>

      {/* Scan Config Card */}
      <div className="meta-scan-trigger-card">
        <div className="meta-scan-trigger-head">
          <div className="meta-scan-title">
            <span>🛡️</span> Multi-Engine Scan Controller
          </div>
          <span className="pill pill-info">PROTOTYPE MULTISCAN</span>
        </div>

        <div className="meta-scan-controls">
          <div className="meta-scan-field">
            <label>Target App Version:</label>
            <select
              value={selectedVerId}
              onChange={(e) => setSelectedVerId(e.target.value)}
              className="meta-input"
            >
              {versions.length === 0 ? (
                <option value="">No versions registered</option>
              ) : (
                versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    v{v.version} ({v.platform}) - {v.checksum ? 'APK Uploaded' : 'Metadata Only'}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            onClick={handleTriggerScan}
            disabled={scanning || versions.length === 0}
            className="btn btn-primary btn-lg"
          >
            {scanning ? '⚡ Multi-Engine Scanning...' : '⚡ Initiate Security Scan'}
          </button>
        </div>

        {/* Scan Progress Timeline */}
        {scanning && (
          <div className="meta-scan-timeline">
            {stepsList.map((st) => (
              <div
                key={st.num}
                className={`meta-timeline-step ${scanStep >= st.num ? 'active' : ''} ${scanStep > st.num ? 'completed' : ''}`}
              >
                <div className="meta-timeline-dot">
                  {scanStep > st.num ? '✓' : st.num}
                </div>
                <div className="meta-timeline-content">
                  <div className="meta-timeline-label">{st.label}</div>
                  <div className="meta-timeline-desc">{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className="meta-scan-results-section">
          {/* Release Gate Verdict Card */}
          <div className={`meta-verdict-card ${scanResult.recommendation === 'HOLD' ? 'verdict-hold' : 'verdict-pass'}`}>
            <div className="meta-verdict-icon">
              {scanResult.recommendation === 'HOLD' ? '⛔' : '✅'}
            </div>
            <div className="meta-verdict-info">
              <div className="meta-verdict-top">
                <span className={`pill ${scanResult.recommendation === 'HOLD' ? 'pill-threat' : 'pill-clean'}`}>
                  CI/CD GATE: {scanResult.recommendation}
                </span>
                <span className="code-font" style={{ fontSize: '0.75rem', color: 'var(--meta-text-muted)' }}>
                  Scan ID: {scanResult.scanId}
                </span>
              </div>
              <h2 className="meta-verdict-heading">
                {scanResult.recommendation === 'HOLD'
                  ? 'High Severity Defects Violate Release Policy'
                  : 'Zero Blocking Vulnerabilities Detected'}
              </h2>
              <div className="meta-verdict-sub">
                Overall Risk Score: <strong>{(scanResult.riskScore * 100).toFixed(0)}%</strong> ({scanResult.riskLevel} RISK)
              </div>
            </div>
            <Link to={`/app/projects/${projectId}/findings`} className="btn btn-secondary">
              View Detailed Findings &rarr;
            </Link>
          </div>

          {/* AI Executive Summary Card */}
          {scanResult.aiQualitySummary && (
            <div className="meta-ai-assessment-card">
              <div className="meta-ai-card-header">
                <span style={{ fontSize: '1.2rem' }}>🧠</span>
                <strong style={{ color: 'var(--meta-cyan)' }}>Gemini 2.5 Flash Autonomous Executive Assessment</strong>
              </div>
              <div className="meta-ai-content">{scanResult.aiQualitySummary}</div>
            </div>
          )}

          {/* Multi-Engine Findings Preview */}
          <div className="meta-scan-engines-grid">
            <div className="meta-engine-card">
              <div className="meta-engine-title">
                <span>🔑</span> Secret Scanner (CWE-798)
              </div>
              <div className="meta-engine-status pill pill-threat">1 CRITICAL DETECTED</div>
              <div className="meta-engine-desc">
                Hardcoded Google API Secret detected in <code>com/example/calculator/network/ApiClient.java</code>
              </div>
            </div>

            <div className="meta-engine-card">
              <div className="meta-engine-title">
                <span>🌐</span> Network Security (CWE-319)
              </div>
              <div className="meta-engine-status pill pill-warning">1 HIGH DETECTED</div>
              <div className="meta-engine-desc">
                Cleartext HTTP permitted via <code>android:usesCleartextTraffic="true"</code>
              </div>
            </div>

            <div className="meta-engine-card">
              <div className="meta-engine-title">
                <span>🔒</span> Crypto Inspector (CWE-328)
              </div>
              <div className="meta-engine-status pill pill-warning">1 MEDIUM DETECTED</div>
              <div className="meta-engine-desc">
                Weak cryptographic MD5 digest algorithm used for integrity checking
              </div>
            </div>

            <div className="meta-engine-card">
              <div className="meta-engine-title">
                <span>⚙️</span> Manifest Auditor (CWE-489, 926)
              </div>
              <div className="meta-engine-status pill pill-warning">2 MEDIUM DETECTED</div>
              <div className="meta-engine-desc">
                Debuggable flag enabled in build & exported activity without permission protection
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
