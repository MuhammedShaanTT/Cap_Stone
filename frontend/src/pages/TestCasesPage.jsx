import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import './TestCasesPage.css';

export default function TestCasesPage() {
  const { projectId } = useParams();
  const { notifyError } = useToast();

  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState(null);

  const loadTestCases = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await projectService.getTestCases(projectId);
      setTestCases(Array.isArray(data) ? data : []);
    } catch (err) {
      notifyError(err.message || 'Could not fetch test cases');
    } finally {
      setLoading(false);
    }
  }, [projectId, notifyError]);

  useEffect(() => {
    loadTestCases();
  }, [loadTestCases]);

  const filteredCases = testCases.filter((tc) => {
    const matchesSearch =
      !search ||
      tc.name?.toLowerCase().includes(search.toLowerCase()) ||
      tc.description?.toLowerCase().includes(search.toLowerCase()) ||
      tc.steps?.some((s) => s.target?.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || tc.category?.toUpperCase() === categoryFilter;
    const matchesPri = priorityFilter === 'ALL' || tc.priority?.toUpperCase() === priorityFilter;

    return matchesSearch && matchesCat && matchesPri;
  });

  return (
    <div className="meta-testcases-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">AI Test Suites & Appium Locators</h1>
          <p className="meta-page-sub">
            Repository of functional and security test cases synthesized autonomously by Gemini 2.5 Flash from mobile APK bytecode.
          </p>
        </div>
        <div className="meta-header-actions">
          <Link to={`/app/projects/${projectId}/versions`} className="btn btn-primary">
            🧠 Synthesize New Suite
          </Link>
          <button onClick={loadTestCases} className="btn btn-secondary">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="meta-tc-filter-bar">
        <div className="meta-tc-search">
          <span className="meta-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search test cases by name, locator, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="meta-input"
          />
        </div>

        <div className="meta-tc-dropdowns">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="meta-input"
          >
            <option value="ALL">All Categories</option>
            <option value="SECURITY">Security</option>
            <option value="SMOKE">Smoke</option>
            <option value="FUNCTIONAL">Functional</option>
            <option value="PERFORMANCE">Performance</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="meta-input"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="meta-tc-card">
        {loading ? (
          <div className="meta-loading-box">
            <div className="meta-spinner" />
            <div>Loading test cases...</div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="meta-widget-empty">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧪</div>
            <h3>No test cases found</h3>
            <p style={{ marginTop: '4px' }}>
              {testCases.length === 0
                ? 'Upload an APK in the Dropzone with AI synthesis enabled to automatically populate Appium test cases.'
                : 'No test cases match your search or filter criteria.'}
            </p>
            {testCases.length === 0 && (
              <Link
                to={`/app/projects/${projectId}/versions`}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                Go to Dropzone &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="meta-table-wrap">
            <table className="meta-table">
              <thead>
                <tr>
                  <th>PRIORITY</th>
                  <th>CATEGORY</th>
                  <th>TEST CASE NAME</th>
                  <th>STEPS</th>
                  <th>AUTOMATION STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((tc) => (
                  <tr key={tc.id || tc.name}>
                    <td>
                      <span className={`pill ${tc.priority === 'CRITICAL' ? 'pill-threat' : tc.priority === 'HIGH' ? 'pill-warning' : 'pill-info'}`}>
                        {tc.priority || 'HIGH'}
                      </span>
                    </td>
                    <td>
                      <span className="pill pill-info">{tc.category || 'FUNCTIONAL'}</span>
                    </td>
                    <td>
                      <div className="meta-tc-name-cell">
                        <strong className="meta-tc-title">{tc.name}</strong>
                        {tc.description && (
                          <span className="meta-tc-desc">{tc.description}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="code-font meta-tc-steps-badge">
                        {tc.steps?.length || 0} steps
                      </span>
                    </td>
                    <td>
                      <span className="pill pill-clean">APPIUM READY</span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedCase(tc)}
                        className="btn btn-outline btn-sm"
                      >
                        Inspect Steps
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Step Inspector Drawer / Modal */}
      {selectedCase && (
        <div className="meta-modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="meta-modal-card meta-tc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="meta-modal-header">
              <div className="meta-modal-title">
                <span>🧪</span> {selectedCase.name}
              </div>
              <button className="meta-modal-close" onClick={() => setSelectedCase(null)}>
                ✕
              </button>
            </div>

            <div className="meta-drawer-body">
              <div className="meta-drawer-meta-row">
                <span className={`pill ${selectedCase.priority === 'CRITICAL' ? 'pill-threat' : 'pill-warning'}`}>
                  {selectedCase.priority}
                </span>
                <span className="pill pill-info">{selectedCase.category}</span>
                <span className="code-font" style={{ fontSize: '0.75rem', color: 'var(--meta-text-muted)' }}>
                  ID: {selectedCase.id}
                </span>
              </div>

              {selectedCase.description && (
                <p className="meta-drawer-desc">{selectedCase.description}</p>
              )}

              {/* Steps Table */}
              <h4 style={{ fontSize: '0.85rem', color: 'var(--meta-cyan)', margin: '1rem 0 0.5rem 0' }}>
                Automated Test Execution Steps ({selectedCase.steps?.length || 0})
              </h4>
              <div className="meta-steps-list">
                {selectedCase.steps?.map((st, i) => (
                  <div key={i} className="meta-step-card">
                    <div className="meta-step-num">#{st.order || i + 1}</div>
                    <div className="meta-step-main">
                      <div className="meta-step-action-row">
                        <span className="meta-step-action">{st.action}</span>
                        <code className="code-font meta-step-target">{st.target}</code>
                      </div>
                      <div className="meta-step-desc">{st.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCase.expectedResults && selectedCase.expectedResults.length > 0 && (
                <div className="meta-expected-box">
                  <strong>Expected Outcome:</strong>
                  <ul>
                    {selectedCase.expectedResults.map((er, idx) => (
                      <li key={idx}>{er}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="meta-modal-footer">
              <button onClick={() => setSelectedCase(null)} className="btn btn-secondary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
