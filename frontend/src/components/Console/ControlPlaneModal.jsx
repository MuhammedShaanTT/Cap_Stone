import React, { useState, useEffect } from 'react';
import './Console.css';
import AuthBox from './AuthBox';
import DefectScanner from './DefectScanner';
import ApkUploader from './ApkUploader';
import { authService } from '../../services/authService';
import { projectService } from '../../services/projectService';
import { qualityService } from '../../services/qualityService';

export default function ControlPlaneModal({ isOpen, onClose, initialView }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [appVersions, setAppVersions] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newVersionInput, setNewVersionInput] = useState('');
  const [showNewVersionForm, setShowNewVersionForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAuthAndLoad();
    }
  }, [isOpen]);

  const checkAuthAndLoad = async () => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      await loadProjects();
    } else {
      setUser(null);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data || []);
      if (data && data.length > 0) {
        const firstId = data[0].id;
        setSelectedProjectId(firstId);
        await refreshProjectData(firstId);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjectData = async (pId) => {
    if (!pId) return;
    try {
      // 1. Fetch dashboard counts
      const dash = await projectService.getDashboard(pId);
      setDashboardMetrics(dash);

      // 2. Fetch all app versions with artifacts
      const versions = await projectService.getAppVersions(pId);
      setAppVersions(versions || []);
    } catch (err) {
      console.error('Failed to refresh project data:', err);
    }
  };

  const handleProjectChange = (e) => {
    const pId = e.target.value;
    setSelectedProjectId(pId);
    refreshProjectData(pId);
  };

  const handleCreateVersion = async (e) => {
    e.preventDefault();
    if (!newVersionInput.trim()) return;
    try {
      await projectService.createAppVersion(selectedProjectId, newVersionInput.trim());
      setNewVersionInput('');
      setShowNewVersionForm(false);
      await refreshProjectData(selectedProjectId);
    } catch (err) {
      alert(`Error creating version: ${err.message}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setProjects([]);
    setAppVersions([]);
    setDashboardMetrics(null);
  };

  if (!isOpen) return null;

  // Safe metric resolution supporting both naming conventions
  const appVerCount = dashboardMetrics?.appVersionCount ?? dashboardMetrics?.totalAppVersions ?? appVersions.length ?? 0;
  const testCaseCount = dashboardMetrics?.testCaseCount ?? dashboardMetrics?.totalTestCases ?? 0;
  const secScanCount = dashboardMetrics?.securityScanCount ?? dashboardMetrics?.totalSecurityScans ?? 0;

  return (
    <div className="console-modal-overlay" onClick={onClose}>
      <div className="console-window" onClick={e => e.stopPropagation()}>
        {/* Top bar */}
        <div className="console-topbar">
          <div className="console-title">
            <span style={{ color: 'var(--sauce-red)' }}>●</span>
            <span>Aura Quality Cloud &mdash; Interactive Live Control Plane</span>
            {user && (
              <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: '4px', color: '#94a3b8' }}>
                User: {user.email} ({user.role})
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user && (
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Sign Out
              </button>
            )}
            <button className="console-close-btn" onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="console-body">
          {!user ? (
            <AuthBox onAuthenticated={checkAuthAndLoad} />
          ) : (
            <div>
              {/* Project selector bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
                background: '#1e293b',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>Active Mobile Project:</span>
                  <select
                    value={selectedProjectId}
                    onChange={handleProjectChange}
                    style={{
                      background: '#0f172a',
                      color: '#fff',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => refreshProjectData(selectedProjectId)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#fff', borderColor: '#475569' }}
                  >
                    ↻ Refresh Metrics
                  </button>
                </div>
              </div>

              {/* Real-time Metrics Tiles */}
              <div className="console-metrics-row">
                <div className="console-metric-tile">
                  <div className="console-metric-val">{appVerCount}</div>
                  <div className="console-metric-lbl">App Versions</div>
                </div>
                <div className="console-metric-tile">
                  <div className="console-metric-val">{testCaseCount}</div>
                  <div className="console-metric-lbl">Test Cases</div>
                </div>
                <div className="console-metric-tile">
                  <div className="console-metric-val">{secScanCount}</div>
                  <div className="console-metric-lbl">Security Scans</div>
                </div>
              </div>

              {/* Visible App Versions & Binaries List */}
              <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📱</span>
                    <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
                      Project App Versions & Uploaded APK Binaries ({appVersions.length})
                    </strong>
                  </div>
                  <button
                    onClick={() => setShowNewVersionForm(!showNewVersionForm)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#38bdf8', borderColor: '#38bdf8' }}
                  >
                    {showNewVersionForm ? '✕ Cancel' : '+ Add Version Tag'}
                  </button>
                </div>

                {/* Inline form to add version tag */}
                {showNewVersionForm && (
                  <form onSubmit={handleCreateVersion} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. 2.1.0-release"
                      value={newVersionInput}
                      onChange={e => setNewVersionInput(e.target.value)}
                      style={{
                        flex: 1,
                        background: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: '4px',
                        padding: '0.4rem 0.75rem',
                        color: '#fff',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button type="submit" className="btn btn-sauce btn-sm" style={{ padding: '0.4rem 0.75rem' }}>
                      Save Version
                    </button>
                  </form>
                )}

                {/* Versions list */}
                {appVersions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                    No app versions registered yet. Upload an APK file below to automatically register one!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {appVersions.map(v => {
                      const hasBinary = Boolean(v.checksum || v.artifactRef);
                      const sizeDisplay = v.fileSizeBytes
                        ? (v.fileSizeBytes > 1024 * 1024
                            ? (v.fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
                            : (v.fileSizeBytes / 1024).toFixed(1) + ' KB')
                        : null;

                      return (
                        <div
                          key={v.id}
                          style={{
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{
                              background: 'var(--sauce-red-subtle)',
                              color: 'var(--sauce-red)',
                              border: '1px solid rgba(235,20,76,0.3)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.78rem'
                            }}>
                              v{v.version}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {v.platform} • <code style={{ color: '#60a5fa' }}>{v.packageName || 'com.example.calculator'}</code>
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {hasBinary ? (
                              <span style={{
                                fontSize: '0.75rem',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                border: '1px solid #10b981',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}>
                                <span>🟢 APK Ready</span>
                                {sizeDisplay && <span>({sizeDisplay})</span>}
                                {v.checksum && (
                                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                    • SHA: {v.checksum.substring(0, 8)}...
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '0.72rem',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: '#fbbf24',
                                border: '1px solid #f59e0b',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                🟡 No Binary Uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dual Action Grid: Defect Scanner & APK Uploader */}
              <div className="console-grid-2">
                <DefectScanner
                  projectId={selectedProjectId}
                  onScanComplete={() => refreshProjectData(selectedProjectId)}
                />
                <ApkUploader
                  projectId={selectedProjectId}
                  appVersions={appVersions}
                  onUploadSuccess={() => refreshProjectData(selectedProjectId)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
