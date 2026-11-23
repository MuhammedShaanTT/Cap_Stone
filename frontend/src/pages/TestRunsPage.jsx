import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import './TestRunsPage.css';

export default function TestRunsPage() {
  const { projectId } = useParams();
  const { notifySuccess, notifyError } = useToast();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [branchInput, setBranchInput] = useState('main');
  const [showModal, setShowModal] = useState(false);

  const fetchRuns = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await projectService.getPipelineRuns(projectId);
      setRuns(Array.isArray(data) ? data : []);
    } catch (err) {
      notifyError(err.message || 'Could not fetch pipeline runs');
    } finally {
      setLoading(false);
    }
  }, [projectId, notifyError]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const handleTriggerRun = async (e) => {
    e.preventDefault();
    setTriggering(true);
    try {
      await projectService.createPipelineRun(projectId, branchInput.trim() || 'main');
      notifySuccess(`CI/CD Pipeline run dispatched for branch "${branchInput}"!`, 'Pipeline Triggered');
      setShowModal(false);
      await fetchRuns();
    } catch (err) {
      notifyError(err.message || 'Failed to trigger pipeline run');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="meta-testruns-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">CI/CD Pipeline Runs & Test Executions</h1>
          <p className="meta-page-sub">
            Continuous delivery execution history, parallel Appium test runner runs, and release gate validations.
          </p>
        </div>
        <div className="meta-header-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            ⚡ Trigger New Run
          </button>
          <button onClick={fetchRuns} className="btn btn-secondary">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Runs Table Card */}
      <div className="meta-runs-card">
        <div className="meta-runs-head">
          <div className="meta-runs-title">
            <span>🔄</span> Pipeline Execution Records ({runs.length})
          </div>
          <span className="pill pill-clean">CI/CD GATE INTEGRATED</span>
        </div>

        {loading ? (
          <div className="meta-loading-box">
            <div className="meta-spinner" />
            <div>Loading execution history...</div>
          </div>
        ) : runs.length === 0 ? (
          <div className="meta-widget-empty">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <h3>No pipeline executions recorded</h3>
            <p>
              Trigger your first automated CI/CD pipeline run to execute Appium test suites and evaluate release gates.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
            >
              ⚡ Trigger First Pipeline Run
            </button>
          </div>
        ) : (
          <div className="meta-table-wrap">
            <table className="meta-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>RUN ID</th>
                  <th>BRANCH / COMMIT</th>
                  <th>STARTED</th>
                  <th>EXECUTION SUMMARY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => {
                  const isPassed = r.status === 'PASSED' || r.status === 'SUCCESS';
                  const isFailed = r.status === 'FAILED';
                  return (
                    <tr key={r.id}>
                      <td>
                        <span className={`pill ${isPassed ? 'pill-clean' : isFailed ? 'pill-threat' : 'pill-warning'}`}>
                          {r.status || 'RUNNING'}
                        </span>
                      </td>
                      <td>
                        <code className="code-font meta-run-id">{r.id}</code>
                      </td>
                      <td>
                        <div className="meta-run-branch">
                          <span>🌿 {r.branch || 'main'}</span>
                          <code className="code-font meta-commit-sha">
                            {r.commitSha ? r.commitSha.substring(0, 7) : 'HEAD'}
                          </code>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--meta-text-muted)' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Just now'}
                        </span>
                      </td>
                      <td>
                        <span className="meta-run-summary">
                          {r.summary || 'Appium test matrix executed with automated SAST security scan.'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/app/projects/${projectId}/dashboard`} className="btn btn-outline btn-sm">
                          Telemetry &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trigger Pipeline Modal */}
      {showModal && (
        <div className="meta-modal-overlay" onClick={() => !triggering && setShowModal(false)}>
          <div className="meta-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="meta-modal-header">
              <div className="meta-modal-title">
                <span>⚡</span> Trigger CI/CD Pipeline Execution
              </div>
              <button
                className="meta-modal-close"
                onClick={() => !triggering && setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTriggerRun} className="meta-modal-form">
              <div className="meta-form-group">
                <label>Branch Reference</label>
                <input
                  type="text"
                  placeholder="e.g. main, feature/login-v2"
                  value={branchInput}
                  onChange={(e) => setBranchInput(e.target.value)}
                  required
                  disabled={triggering}
                  className="meta-input"
                />
              </div>

              <div className="meta-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={triggering}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={triggering} className="btn btn-primary">
                  {triggering ? 'Dispatching...' : 'Dispatch Pipeline Run →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
