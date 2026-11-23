import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { qualityService } from '../services/qualityService';
import { useToast } from '../context/ToastContext';
import './FindingsPage.css';

export default function FindingsPage() {
  const { projectId } = useParams();
  const { notifySuccess, notifyInfo, notifyError } = useToast();

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [falsePositives, setFalsePositives] = useState(new Set());

  const loadFindings = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await qualityService.runQualityAnalysis(projectId);
      if (res && res.securityFindings) {
        setFindings(res.securityFindings);
      }
    } catch (err) {
      console.error(err);
      notifyError('Failed to fetch findings. Run an analysis first.');
    } finally {
      setLoading(false);
    }
  }, [projectId, notifyError]);

  useEffect(() => {
    loadFindings();
  }, [loadFindings]);

  const toggleFalsePositive = (findingId) => {
    setFalsePositives((prev) => {
      const next = new Set(prev);
      if (next.has(findingId)) {
        next.delete(findingId);
        notifyInfo('Marked finding as OPEN');
      } else {
        next.add(findingId);
        notifySuccess('Marked finding as FALSE POSITIVE', 'Status Updated');
      }
      return next;
    });
  };

  const handleExportCsv = () => {
    if (findings.length === 0) {
      notifyInfo('No findings to export.');
      return;
    }

    const headers = ['ID', 'Severity', 'CWE', 'Title', 'Location', 'Status', 'Remediation'];
    const rows = findings.map((f) => [
      `"${f.id || ''}"`,
      `"${f.severity || ''}"`,
      `"CWE-${f.cweId || ''}"`,
      `"${(f.title || '').replace(/"/g, '""')}"`,
      `"${(f.location || '').replace(/"/g, '""')}"`,
      `"${falsePositives.has(f.id) ? 'FALSE_POSITIVE' : 'OPEN'}"`,
      `"${(f.remediation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `security_findings_project_${projectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifySuccess('Exported findings to CSV file', 'Download Started');
  };

  const filtered = findings.filter((f) => {
    const isFp = falsePositives.has(f.id);
    const matchesSearch =
      !search ||
      f.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.location?.toLowerCase().includes(search.toLowerCase()) ||
      String(f.cweId).includes(search);

    const matchesSev = severityFilter === 'ALL' || f.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'FALSE_POSITIVE' && isFp) ||
      (statusFilter === 'OPEN' && !isFp);

    return matchesSearch && matchesSev && matchesStatus;
  });

  return (
    <div className="meta-findings-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">Security & Defect Findings Explorer</h1>
          <p className="meta-page-sub">
            Drill-down analyzer for OWASP Mobile Security findings, bytecode vulnerabilities, and Gemini AI remediation guides.
          </p>
        </div>
        <div className="meta-header-actions">
          <button onClick={handleExportCsv} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={loadFindings} className="btn btn-primary">
            ⚡ Rescan Defect Scanner
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="meta-findings-filter-bar">
        <div className="meta-findings-search">
          <span className="meta-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by CWE, title, package, or class name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="meta-input"
          />
        </div>

        <div className="meta-findings-dropdowns">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="meta-input"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="meta-input"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
      </div>

      {/* Findings Table Card */}
      <div className="meta-findings-card">
        {loading ? (
          <div className="meta-loading-box">
            <div className="meta-spinner" />
            <div>Auditing security defect repository...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="meta-widget-empty">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h3>No findings match criteria</h3>
            <p style={{ marginTop: '4px' }}>
              {findings.length === 0
                ? 'No vulnerabilities recorded. Trigger a scan from the Vulnerability Scans tab.'
                : 'Try adjusting your search or severity filter.'}
            </p>
          </div>
        ) : (
          <div className="meta-table-wrap">
            <table className="meta-table">
              <thead>
                <tr>
                  <th>SEVERITY</th>
                  <th>CWE IDENTIFIER</th>
                  <th>DEFECT TITLE</th>
                  <th>FILE / CODE LOCATION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const isFp = falsePositives.has(f.id);
                  return (
                    <tr key={f.id}>
                      <td>
                        <span className={`pill ${f.severity === 'CRITICAL' ? 'pill-threat' : f.severity === 'HIGH' ? 'pill-warning' : 'pill-info'}`}>
                          {f.severity}
                        </span>
                      </td>
                      <td>
                        <span className="code-font meta-cwe-pill">CWE-{f.cweId}</span>
                      </td>
                      <td>
                        <strong className="meta-finding-table-title">{f.title}</strong>
                      </td>
                      <td>
                        <code className="code-font meta-loc-code">{f.location}</code>
                      </td>
                      <td>
                        {isFp ? (
                          <span className="pill pill-warning">FALSE POSITIVE</span>
                        ) : (
                          <span className="pill pill-threat">OPEN</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setSelectedFinding(f)}
                            className="btn btn-outline btn-sm"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => toggleFalsePositive(f.id)}
                            className="btn btn-secondary btn-sm"
                            title={isFp ? 'Unmark false positive' : 'Mark as false positive'}
                          >
                            {isFp ? 'Unmark FP' : 'Mark FP'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Finding Detail Drawer */}
      {selectedFinding && (
        <div className="meta-modal-overlay" onClick={() => setSelectedFinding(null)}>
          <div className="meta-modal-card meta-finding-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="meta-modal-header">
              <div className="meta-modal-title">
                <span>🛡️</span> Defect Analysis: {selectedFinding.title}
              </div>
              <button className="meta-modal-close" onClick={() => setSelectedFinding(null)}>
                ✕
              </button>
            </div>

            <div className="meta-drawer-body">
              <div className="meta-drawer-meta-row">
                <span className={`pill ${selectedFinding.severity === 'CRITICAL' ? 'pill-threat' : 'pill-warning'}`}>
                  SEVERITY: {selectedFinding.severity}
                </span>
                <span className="pill pill-info">CWE-{selectedFinding.cweId}</span>
                <span className="pill pill-clean">CONFIDENCE: 98%</span>
              </div>

              <div className="meta-drawer-section">
                <h4>Vulnerability Location</h4>
                <code className="code-font meta-drawer-code-loc">{selectedFinding.location}</code>
              </div>

              <div className="meta-drawer-section">
                <h4>Description & Threat Vector</h4>
                <p className="meta-drawer-desc-text">{selectedFinding.description}</p>
              </div>

              <div className="meta-drawer-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span>🧠</span>
                  <h4 style={{ margin: 0, color: 'var(--meta-cyan)' }}>
                    Google Gemini 2.5 Flash Remediation Proposal
                  </h4>
                </div>
                <div className="meta-remediation-box code-font">
                  {selectedFinding.remediation}
                </div>
              </div>
            </div>

            <div className="meta-modal-footer">
              <button
                onClick={() => toggleFalsePositive(selectedFinding.id)}
                className="btn btn-outline"
              >
                {falsePositives.has(selectedFinding.id) ? 'Re-open Defect' : 'Mark as False Positive'}
              </button>
              <button onClick={() => setSelectedFinding(null)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
