import React, { useEffect, useMemo, useState } from 'react';
import './Console.css';
import AuthBox from './AuthBox';
import DefectScanner from './DefectScanner';
import ApkUploader from './ApkUploader';
import { authService } from '../../services/authService';
import { projectService } from '../../services/projectService';

const TESTING_NAV = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'versions', label: 'App versions', icon: '▣' },
  { id: 'analysis', label: 'Analysis & fixes', icon: '⌁' },
  { id: 'runs', label: 'Test runs', icon: '▶' }
];

const SECURITY_NAV = [
  { id: 'security-overview', label: 'Security overview', icon: '◇' },
  { id: 'security-findings', label: 'Findings', icon: '!' },
  { id: 'security-roadmap', label: 'Security roadmap', icon: '→' }
];

export default function ControlPlaneModal({ isOpen, onClose, initialView = 'dashboard', initialMode = 'testing' }) {
  const [mode, setMode] = useState(initialMode);
  const [section, setSection] = useState(initialView === 'defect-test' ? 'analysis' : 'overview');
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [appVersions, setAppVersions] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newVersionInput, setNewVersionInput] = useState('');
  const [showNewVersionForm, setShowNewVersionForm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setSection(initialView === 'defect-test' ? 'analysis' : 'overview');
    checkAuthAndLoad();
  }, [isOpen, initialView, initialMode]);

  const checkAuthAndLoad = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      return;
    }

    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    await loadProjects();
  };

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      const availableProjects = data || [];
      setProjects(availableProjects);
      if (availableProjects.length > 0) {
        const nextProjectId = availableProjects.some(p => p.id === selectedProjectId)
          ? selectedProjectId
          : availableProjects[0].id;
        setSelectedProjectId(nextProjectId);
        await refreshProjectData(nextProjectId);
      } else {
        setSelectedProjectId('');
        setAppVersions([]);
        setDashboardMetrics(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const refreshProjectData = async (projectId) => {
    if (!projectId) return;
    setError(null);
    try {
      const [dashboard, versions] = await Promise.all([
        projectService.getDashboard(projectId),
        projectService.getAppVersions(projectId)
      ]);
      setDashboardMetrics(dashboard);
      setAppVersions(versions || []);
    } catch (err) {
      setError(err.message || 'Unable to refresh project data.');
    }
  };

  const handleProjectChange = async (event) => {
    const projectId = event.target.value;
    setSelectedProjectId(projectId);
    await refreshProjectData(projectId);
  };

  const handleCreateVersion = async (event) => {
    event.preventDefault();
    if (!newVersionInput.trim() || !selectedProjectId) return;

    try {
      await projectService.createAppVersion(selectedProjectId, newVersionInput.trim());
      setNewVersionInput('');
      setShowNewVersionForm(false);
      await refreshProjectData(selectedProjectId);
    } catch (err) {
      setError(err.message || 'Unable to create app version.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setProjects([]);
    setAppVersions([]);
    setDashboardMetrics(null);
    setSelectedProjectId('');
  };

  const metrics = useMemo(() => ({
    appVersions: dashboardMetrics?.appVersionCount ?? appVersions.length ?? 0,
    testCases: dashboardMetrics?.testCaseCount ?? 0,
    testRuns: dashboardMetrics?.testRunCount ?? 0,
    passedRuns: dashboardMetrics?.testRunPassedCount ?? 0,
    failedRuns: dashboardMetrics?.testRunFailedCount ?? 0,
    scans: dashboardMetrics?.securityScanCount ?? 0
  }), [dashboardMetrics, appVersions.length]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="console-modal-overlay" onClick={onClose}>
        <div className="console-window console-auth-window" onClick={event => event.stopPropagation()}>
          <div className="console-topbar">
            <div className="console-title"><span className="console-brand-dot">●</span> Aura Quality Cloud</div>
            <button className="console-close-btn" onClick={onClose} aria-label="Close console">&times;</button>
          </div>
          <div className="console-body">
            <AuthBox onAuthenticated={checkAuthAndLoad} />
          </div>
        </div>
      </div>
    );
  }

  const navigation = mode === 'testing' ? TESTING_NAV : SECURITY_NAV;
  const selectedProject = projects.find(project => project.id === selectedProjectId);

  return (
    <div className="console-modal-overlay" onClick={onClose}>
      <div className="console-window console-workspace" onClick={event => event.stopPropagation()}>
        <header className="console-topbar">
          <div className="console-title">
            <span className="console-brand-dot">●</span>
            <span>Aura Quality Cloud</span>
            <span className="console-environment-badge">Phase 1 workspace</span>
          </div>
          <div className="console-account-actions">
            <span className="console-user-label">{user.email} · {user.role}</span>
            <button className="console-signout-btn" onClick={handleLogout}>Sign out</button>
            <button className="console-close-btn" onClick={onClose} aria-label="Close console">&times;</button>
          </div>
        </header>

        <div className="console-workspace-body">
          <aside className="console-sidebar">
            <div className="console-mode-switch" role="tablist" aria-label="Platform mode">
              <button
                className={mode === 'testing' ? 'active' : ''}
                onClick={() => { setMode('testing'); setSection('overview'); }}
                role="tab"
                aria-selected={mode === 'testing'}
              >
                Testing
              </button>
              <button
                className={mode === 'security' ? 'active security-active' : ''}
                onClick={() => { setMode('security'); setSection('security-overview'); }}
                role="tab"
                aria-selected={mode === 'security'}
              >
                Cybersecurity
              </button>
            </div>

            <div className="console-sidebar-label">{mode === 'testing' ? 'Testing workspace' : 'Security workspace'}</div>
            <nav className="console-sidebar-nav" aria-label={`${mode} navigation`}>
              {navigation.map(item => (
                <button
                  key={item.id}
                  className={section === item.id ? 'active' : ''}
                  onClick={() => setSection(item.id)}
                >
                  <span className="console-nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="console-sidebar-note">
              <strong>Prototype status</strong>
              <span>{mode === 'testing'
                ? 'Testing records and APK metadata use the current MVP API.'
                : 'Security orchestration is planned and shown separately from testing.'}</span>
            </div>
          </aside>

          <main className="console-main">
            <div className="console-project-bar">
              <div>
                <span className="console-eyebrow">Active project</span>
                <select value={selectedProjectId} onChange={handleProjectChange} aria-label="Select active project">
                  {projects.length === 0 && <option value="">No projects available</option>}
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-outline btn-sm console-refresh-btn" onClick={() => refreshProjectData(selectedProjectId)}>
                ↻ Refresh
              </button>
            </div>

            {error && <div className="console-alert console-alert-error" role="alert">{error}</div>}
            {loading && <div className="console-loading" role="status">Loading project data...</div>}

            {!loading && mode === 'testing' && section === 'overview' && (
              <TestingOverview
                metrics={metrics}
                selectedProject={selectedProject}
                onNavigate={setSection}
                onScanComplete={() => refreshProjectData(selectedProjectId)}
                projectId={selectedProjectId}
                appVersions={appVersions}
              />
            )}

            {!loading && mode === 'testing' && section === 'versions' && (
              <VersionsWorkspace
                appVersions={appVersions}
                newVersionInput={newVersionInput}
                onNewVersionInput={setNewVersionInput}
                onCreateVersion={handleCreateVersion}
                showNewVersionForm={showNewVersionForm}
                onToggleForm={() => setShowNewVersionForm(value => !value)}
                projectId={selectedProjectId}
                onUploadSuccess={() => refreshProjectData(selectedProjectId)}
              />
            )}

            {!loading && mode === 'testing' && section === 'analysis' && (
              <AnalysisWorkspace projectId={selectedProjectId} onScanComplete={() => refreshProjectData(selectedProjectId)} />
            )}

            {!loading && mode === 'testing' && section === 'runs' && (
              <PlaceholderPanel
                eyebrow="Test runs"
                title="Execution history is the next testing increment"
                description="The current API can create queued test-run records, but it does not yet execute Appium jobs. This screen is reserved for real run status, device details, logs, screenshots, and trend data."
                actionLabel="Open analysis"
                onAction={() => setSection('analysis')}
              />
            )}

            {!loading && mode === 'security' && (
              <SecurityWorkspace section={section} metrics={metrics} onReturnToTesting={() => { setMode('testing'); setSection('overview'); }} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TestingOverview({ metrics, selectedProject, onNavigate, onScanComplete, projectId, appVersions }) {
  const passRate = metrics.testRuns > 0 ? Math.round((metrics.passedRuns / metrics.testRuns) * 100) : 0;

  return (
    <div className="console-page">
      <PageHeading
        eyebrow="Testing mode"
        title={selectedProject?.name || 'Project overview'}
        description="A single workspace for app versions, AI-assisted analysis, and test quality decisions."
      />

      <div className="console-metrics-grid">
        <MetricCard label="App versions" value={metrics.appVersions} hint="Registered builds" />
        <MetricCard label="Test cases" value={metrics.testCases} hint="Structured scenarios" />
        <MetricCard label="Test runs" value={metrics.testRuns} hint={`${metrics.failedRuns} failed`} tone={metrics.failedRuns > 0 ? 'warning' : 'default'} />
        <MetricCard label="Pass rate" value={`${passRate}%`} hint={metrics.testRuns ? `${metrics.passedRuns} passed` : 'No executions yet'} tone={passRate >= 80 ? 'success' : 'default'} />
      </div>

      <div className="console-content-grid">
        <section className="console-panel">
          <PanelHeading title="Testing progress" action="View analysis" onAction={() => onNavigate('analysis')} />
          <div className="console-chart" aria-label="Testing result trend placeholder">
            <div className="console-chart-bars">
              {[42, 58, 48, 72, 64, 82, passRate || 20].map((height, index) => (
                <div className="console-chart-column" key={index}>
                  <span style={{ height: `${height}%` }} />
                  <small>R{index + 1}</small>
                </div>
              ))}
            </div>
            <div className="console-chart-caption">Basic result visualization. Historical trend endpoints will replace this prototype chart.</div>
          </div>
        </section>

        <section className="console-panel">
          <PanelHeading title="Recommended next step" />
          <div className="console-recommendation">
            <span className="console-recommendation-icon">✦</span>
            <div>
              <strong>{appVersions.length ? 'Run an analysis on an uploaded build' : 'Upload your first APK'}</strong>
              <p>{appVersions.length
                ? 'Review the generated findings and proposed locator change before deciding whether to continue.'
                : 'Register a version and upload an APK to begin the testing workflow.'}</p>
            </div>
          </div>
          <button className="btn btn-sauce btn-sm" onClick={() => onNavigate(appVersions.length ? 'analysis' : 'versions')}>
            {appVersions.length ? 'Start analysis' : 'Open app versions'}
          </button>
        </section>
      </div>

      <div className="console-content-grid">
        <DefectScanner projectId={projectId} onScanComplete={onScanComplete} />
        <ApkUploader projectId={projectId} appVersions={appVersions} onUploadSuccess={onScanComplete} />
      </div>
    </div>
  );
}

function VersionsWorkspace({ appVersions, newVersionInput, onNewVersionInput, onCreateVersion, showNewVersionForm, onToggleForm, projectId, onUploadSuccess }) {
  return (
    <div className="console-page">
      <PageHeading
        eyebrow="Build inventory"
        title="App versions and artifacts"
        description="Register versions, attach APKs, and keep the build identity visible before analysis."
        action={<button className="btn btn-sauce btn-sm" onClick={onToggleForm}>{showNewVersionForm ? 'Cancel' : '+ Add version'}</button>}
      />

      {showNewVersionForm && (
        <form className="console-inline-form" onSubmit={onCreateVersion}>
          <label htmlFor="new-version">Version label</label>
          <input id="new-version" value={newVersionInput} onChange={event => onNewVersionInput(event.target.value)} placeholder="e.g. 2.1.0-release" required />
          <button className="btn btn-sauce btn-sm" type="submit">Save version</button>
        </form>
      )}

      <section className="console-panel">
        <PanelHeading title={`${appVersions.length} registered version${appVersions.length === 1 ? '' : 's'}`} />
        {appVersions.length === 0 ? (
          <EmptyState title="No app versions yet" description="Create a version or upload an APK to start building your testing inventory." />
        ) : (
          <div className="console-version-list">
            {appVersions.map(version => (
              <VersionRow key={version.id} version={version} />
            ))}
          </div>
        )}
      </section>

      <ApkUploader projectId={projectId} appVersions={appVersions} onUploadSuccess={onUploadSuccess} />
    </div>
  );
}

function AnalysisWorkspace({ projectId, onScanComplete }) {
  return (
    <div className="console-page">
      <PageHeading
        eyebrow="Testing analysis"
        title="Results, explanations, and proposed fixes"
        description="Run the current quality-analysis demonstration, then review the evidence and suggested next action."
      />
      <div className="console-analysis-notice">
        <strong>Prototype data notice</strong>
        <span>The current backend generates synthetic analysis records. Real Appium execution and scanner evidence will be connected in a later phase.</span>
      </div>
      <DefectScanner projectId={projectId} onScanComplete={onScanComplete} />
      <section className="console-panel console-fix-panel">
        <PanelHeading title="User review gate" />
        <p>Every future fix should be reviewed here before it is applied. The approval, rejection, feedback, and verification actions are reserved for the next backend workflow phase.</p>
        <div className="console-action-row">
          <button className="btn btn-sauce btn-sm" disabled>Approve and verify</button>
          <button className="btn btn-outline btn-sm" disabled>Reject suggestion</button>
        </div>
      </section>
    </div>
  );
}

function SecurityWorkspace({ section, metrics, onReturnToTesting }) {
  if (section === 'security-roadmap') {
    return (
      <div className="console-page">
        <PageHeading eyebrow="Future scope" title="Cybersecurity roadmap" description="Security is intentionally separated from testing so scanner evidence and release decisions remain easy to understand." />
        <div className="console-roadmap-grid">
          <RoadmapCard title="APK static analysis" description="Manifest, binary, insecure storage, cryptography, exported components, and secret checks." status="Planned" />
          <RoadmapCard title="SBOM and dependencies" description="Track packages, licenses, known vulnerabilities, and supply-chain risk." status="Planned" />
          <RoadmapCard title="API and network security" description="Authorized API checks, transport security, authentication, and runtime network evidence." status="Planned" />
          <RoadmapCard title="Security approval" description="Review findings, record feedback, remediate, and re-scan before release." status="Planned" />
        </div>
      </div>
    );
  }

  return (
    <div className="console-page">
      <PageHeading
        eyebrow="Cybersecurity mode"
        title={section === 'security-findings' ? 'Security findings' : 'Security overview'}
        description="This is a separate security workspace. Scanner integrations are planned and are not represented as active in the current MVP."
      />
      <div className="console-analysis-notice console-security-notice">
        <strong>Security module status: planned</strong>
        <span>Future scans will include static analysis, SBOM/dependency checks, API security, evidence-backed remediation, and re-scan approval.</span>
      </div>
      <div className="console-metrics-grid">
        <MetricCard label="Queued scans" value={metrics.scans} hint="Current MVP records" />
        <MetricCard label="Critical findings" value="—" hint="Scanner integration pending" tone="warning" />
        <MetricCard label="Security score" value="—" hint="Requires verified evidence" />
        <MetricCard label="SBOM coverage" value="—" hint="Planned capability" />
      </div>
      <PlaceholderPanel
        eyebrow="Separate module"
        title="Testing remains the active workflow"
        description="Use the mode switch at any time to return to testing. This separation keeps future security findings from being confused with test failures."
        actionLabel="Return to testing"
        onAction={onReturnToTesting}
      />
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="console-page-heading">
      <div>
        <span className="console-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function PanelHeading({ title, action, onAction }) {
  return (
    <div className="console-panel-heading">
      <h2>{title}</h2>
      {action && <button className="console-text-button" onClick={onAction}>{action} →</button>}
    </div>
  );
}

function MetricCard({ label, value, hint, tone = 'default' }) {
  return (
    <div className={`console-metric-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function VersionRow({ version }) {
  const hasArtifact = Boolean(version.checksum || version.artifactRef);
  const size = version.fileSizeBytes
    ? version.fileSizeBytes > 1024 * 1024
      ? `${(version.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(version.fileSizeBytes / 1024).toFixed(1)} KB`
    : 'Size unavailable';

  return (
    <div className="console-version-row">
      <div>
        <strong>v{version.version}</strong>
        <span>{version.platform || 'ANDROID'} · {version.packageName || 'Package unavailable'}</span>
      </div>
      <div className={hasArtifact ? 'console-artifact-ready' : 'console-artifact-pending'}>
        {hasArtifact ? `APK ready · ${size}` : 'No APK attached'}
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return <div className="console-empty-state"><strong>{title}</strong><span>{description}</span></div>;
}

function PlaceholderPanel({ eyebrow, title, description, actionLabel, onAction }) {
  return (
    <section className="console-panel console-placeholder">
      <span className="console-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && <button className="btn btn-outline btn-sm" onClick={onAction}>{actionLabel}</button>}
    </section>
  );
}

function RoadmapCard({ title, description, status }) {
  return (
    <article className="console-roadmap-card">
      <span>{status}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
