import React, { useState } from 'react';

export default function AiPlanViewer({ planData, onClose }) {
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'cases' | 'improvements'
  const [expandedCase, setExpandedCase] = useState(null);

  if (!planData) return null;

  const {
    appName,
    packageName,
    version,
    testPlan,
    generatedTestCases = [],
    applicationImprovements,
    modelUsed,
    persistedTestCasesCount
  } = planData;

  const getPriorityStyle = (priority) => {
    switch ((priority || '').toUpperCase()) {
      case 'CRITICAL':
        return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444' };
      case 'HIGH':
        return { background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', border: '1px solid #f97316' };
      case 'MEDIUM':
        return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid #f59e0b' };
      default:
        return { background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid #0284c7' };
    }
  };

  const getCategoryStyle = (category) => {
    switch ((category || '').toUpperCase()) {
      case 'SECURITY':
        return { background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid #a855f7' };
      case 'SMOKE':
        return { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981' };
      case 'PERFORMANCE':
        return { background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', border: '1px solid #ec4899' };
      default:
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid #3b82f6' };
    }
  };

  return (
    <div style={{
      marginTop: '1.25rem',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid #38bdf8',
      borderRadius: '10px',
      padding: '1.25rem',
      boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.15)',
      color: '#fff',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #334155',
        paddingBottom: '0.85rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🧠</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              Autonomous AI Quality Plan & Test Suite
            </h3>
            <span style={{
              fontSize: '0.68rem',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#0f172a',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase'
            }}>
              Powered by {modelUsed || 'Gemini 2.5 Flash'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            App: <strong style={{ color: '#fff' }}>{appName}</strong> &nbsp;|&nbsp;
            Package: <code style={{ color: '#38bdf8' }}>{packageName}</code> &nbsp;|&nbsp;
            Version: <strong style={{ color: '#fff' }}>{version}</strong>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1
            }}
            title="Dismiss AI Plan View"
          >
            ✕
          </button>
        )}
      </div>

      {/* Persistence Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: 'rgba(16, 185, 129, 0.12)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        padding: '0.6rem 0.85rem',
        borderRadius: '6px',
        fontSize: '0.78rem',
        color: '#34d399',
        marginBottom: '1rem'
      }}>
        <span>✅</span>
        <span>
          <strong>{persistedTestCasesCount} candidate test cases</strong> were synthesized and automatically persisted directly to the MongoDB project repository. Ready for automated Appium execution!
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #334155',
        paddingBottom: '0.5rem',
        marginBottom: '1.15rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          style={{
            background: activeTab === 'plan' ? '#38bdf8' : '#1e293b',
            color: activeTab === 'plan' ? '#0f172a' : '#cbd5e1',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          📋 Test Strategy & Plan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cases')}
          style={{
            background: activeTab === 'cases' ? '#38bdf8' : '#1e293b',
            color: activeTab === 'cases' ? '#0f172a' : '#cbd5e1',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          🧪 Generated Test Cases ({generatedTestCases.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('improvements')}
          style={{
            background: activeTab === 'improvements' ? '#38bdf8' : '#1e293b',
            color: activeTab === 'improvements' ? '#0f172a' : '#cbd5e1',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          💡 App Improvements & Security
        </button>
      </div>

      {/* TAB 1: TEST PLAN */}
      {activeTab === 'plan' && testPlan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem' }}>
          {/* Executive Summary */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderLeft: '4px solid #38bdf8',
            padding: '0.85rem 1rem',
            borderRadius: '0 6px 6px 0',
            lineHeight: 1.55
          }}>
            <h4 style={{ margin: '0 0 0.35rem 0', color: '#38bdf8', fontSize: '0.9rem' }}>
              {testPlan.title || 'Mobile Test Strategy'}
            </h4>
            <p style={{ margin: 0, color: '#e2e8f0' }}>{testPlan.executiveSummary}</p>
          </div>

          {/* Scope */}
          {testPlan.scope && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155' }}>
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.35rem' }}>🎯 In-Scope Testing</div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#cbd5e1' }}>
                  {testPlan.scope.inScope?.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155' }}>
                <div style={{ fontWeight: 700, color: '#94a3b8', marginBottom: '0.35rem' }}>🚫 Out-of-Scope</div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#94a3b8' }}>
                  {testPlan.scope.outOfScope?.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Device Matrix */}
          {testPlan.deviceMatrix && testPlan.deviceMatrix.length > 0 && (
            <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📱 Target Device & OS Execution Matrix</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {testPlan.deviceMatrix.map((dev, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#1e293b',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '4px',
                    color: '#e2e8f0'
                  }}>
                    <span style={{ color: '#38bdf8' }}>•</span>
                    <span>{dev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testing Phases */}
          {testPlan.testingPhases && testPlan.testingPhases.length > 0 && (
            <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.6rem' }}>
                ⚡ Test Execution Phases
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                {testPlan.testingPhases.map((phase, idx) => (
                  <div key={idx} style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '0.65rem'
                  }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>
                      {phase.phase}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {phase.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exit Criteria */}
          {testPlan.exitCriteria && testPlan.exitCriteria.length > 0 && (
            <div style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                🏁 Release Quality Gates & Exit Criteria
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                {testPlan.exitCriteria.map((crit, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{crit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEST CASES */}
      {activeTab === 'cases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
          {generatedTestCases.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
              No test cases generated.
            </div>
          ) : (
            generatedTestCases.map((tc, idx) => {
              const isExpanded = expandedCase === idx;
              return (
                <div key={tc.id || idx} style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  transition: 'border 0.15s ease'
                }}>
                  {/* Test Case Header */}
                  <div
                    onClick={() => setExpandedCase(isExpanded ? null : idx)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        ...getPriorityStyle(tc.priority)
                      }}>
                        {tc.priority || 'HIGH'}
                      </span>

                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        ...getCategoryStyle(tc.category)
                      }}>
                        {tc.category || 'FUNCTIONAL'}
                      </span>

                      <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {tc.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>{tc.steps?.length || 0} steps</span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid #1e293b', paddingTop: '0.75rem' }}>
                      {/* Preconditions */}
                      {tc.preconditions && tc.preconditions.length > 0 && (
                        <div style={{ marginBottom: '0.6rem', fontSize: '0.76rem', color: '#94a3b8' }}>
                          <strong style={{ color: '#cbd5e1' }}>Preconditions:</strong> {tc.preconditions.join('; ')}
                        </div>
                      )}

                      {/* Steps Table */}
                      <div style={{
                        background: '#1e293b',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '0.6rem'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                          <thead>
                            <tr style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'left' }}>
                              <th style={{ padding: '0.35rem 0.5rem', width: '35px' }}>#</th>
                              <th style={{ padding: '0.35rem 0.5rem', width: '75px' }}>Action</th>
                              <th style={{ padding: '0.35rem 0.5rem' }}>Target / Locator</th>
                              <th style={{ padding: '0.35rem 0.5rem' }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tc.steps?.map((st, sIdx) => (
                              <tr key={sIdx} style={{ borderTop: '1px solid #334155' }}>
                                <td style={{ padding: '0.35rem 0.5rem', color: '#64748b' }}>{st.order || sIdx + 1}</td>
                                <td style={{ padding: '0.35rem 0.5rem' }}>
                                  <span style={{
                                    background: '#0f172a',
                                    color: '#38bdf8',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontWeight: 700,
                                    fontSize: '0.7rem'
                                  }}>
                                    {st.action}
                                  </span>
                                </td>
                                <td style={{ padding: '0.35rem 0.5rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
                                  {st.target}
                                </td>
                                <td style={{ padding: '0.35rem 0.5rem', color: '#94a3b8' }}>
                                  {st.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Expected Results */}
                      {tc.expectedResults && tc.expectedResults.length > 0 && (
                        <div style={{ fontSize: '0.76rem', color: '#34d399' }}>
                          <strong>Expected Outcome:</strong> {tc.expectedResults.join('; ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: APP IMPROVEMENTS */}
      {activeTab === 'improvements' && applicationImprovements && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          {/* Security */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            padding: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🛡️ Security Hardening</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
              {applicationImprovements.security?.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', lineHeight: 1.45 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Performance */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '8px',
            padding: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>⚡ Performance & Battery Optimization</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
              {applicationImprovements.performance?.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', lineHeight: 1.45 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* UI/UX & Accessibility */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '8px',
            padding: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🎨 UI/UX & Accessibility Polish</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
              {applicationImprovements.uiUx?.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', lineHeight: 1.45 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '8px',
            padding: '0.85rem'
          }}>
            <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>🏗️ Architecture & Code Health</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
              {applicationImprovements.architecture?.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', lineHeight: 1.45 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
