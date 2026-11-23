import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import './AppShell.css';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject, refreshProjects } = useProject();
  const { notifyInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  // Sync activeProject if route contains projectId
  useEffect(() => {
    if (projectId && (!activeProject || activeProject.id !== projectId)) {
      const found = projects.find((p) => p.id === projectId);
      if (found) {
        setActiveProject(found);
      }
    }
  }, [projectId, projects, activeProject, setActiveProject]);

  // Periodic health ping to /actuator/health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/actuator/health', { method: 'GET' });
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleProjectSelect = (e) => {
    const targetId = e.target.value;
    if (targetId === '__NEW__') {
      navigate('/app/projects?create=true');
      return;
    }
    const selected = projects.find((p) => p.id === targetId);
    if (selected) {
      setActiveProject(selected);
      const parts = location.pathname.split('/');
      const currentTab = parts[4] || 'dashboard';
      navigate(`/app/projects/${selected.id}/${currentTab}`);
    }
  };

  const handleSignOut = () => {
    logout();
    notifyInfo('You have safely signed out of MetaDefender Console.', 'Signed Out');
    navigate('/login');
  };

  const currentProjectId = activeProject?.id || projectId || (projects.length > 0 ? projects[0].id : '');

  // Dynamic breadcrumb generation
  const pathParts = location.pathname.split('/').filter(Boolean);
  const getBreadcrumbName = (part) => {
    switch (part) {
      case 'app': return 'Console';
      case 'projects': return 'Projects';
      case 'dashboard': return 'Threat & Quality Dashboard';
      case 'versions': return 'Binary Dropzone & Artifacts';
      case 'test-cases': return 'AI Test Suites';
      case 'test-runs': return 'CI/CD Pipeline Runs';
      case 'scans': return 'Vulnerability Scans';
      case 'findings': return 'Security Findings';
      case 'healing': return 'Self-Healing Engine';
      case 'settings': return 'Settings';
      default:
        if (part === currentProjectId && activeProject) return activeProject.name;
        return part;
    }
  };

  return (
    <div className="meta-shell">
      {/* 1. LEFT SIDEBAR */}
      <aside className={`meta-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="meta-sidebar-header">
          <Link to="/" className="meta-brand-logo">
            <div className="meta-brand-icon">
              <span>🛡️</span>
            </div>
            <div>
              <div className="meta-brand-name">AURA<span className="accent">.</span>QA</div>
              <div className="meta-brand-sub">MetaDefender Platform</div>
            </div>
          </Link>
          <button
            className="meta-sidebar-close-mobile"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menus */}
        <nav className="meta-sidebar-nav">
          <div className="meta-nav-group-title">CORE VISIBILITY</div>
          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/dashboard` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">📊</span>
            <span>Security Dashboard</span>
          </NavLink>

          <div className="meta-nav-group-title">ZERO-TRUST AUDIT & AI</div>
          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/versions` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">📦</span>
            <span>APK Dropzone & Files</span>
            <span className="meta-nav-badge">NEW</span>
          </NavLink>

          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/test-cases` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">🧪</span>
            <span>AI Test Cases (Gemini)</span>
          </NavLink>

          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/test-runs` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">🔄</span>
            <span>Pipeline Runs</span>
          </NavLink>

          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/scans` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">🛡️</span>
            <span>Vulnerability Scans</span>
          </NavLink>

          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/findings` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">🔍</span>
            <span>Threat Findings</span>
          </NavLink>

          <NavLink
            to={currentProjectId ? `/app/projects/${currentProjectId}/healing` : '/app/projects'}
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">⚡</span>
            <span>Self-Healing Locators</span>
          </NavLink>

          <div className="meta-nav-group-title">CENTRAL MANAGEMENT</div>
          <NavLink
            to="/app/projects"
            end
            className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="meta-nav-icon">📁</span>
            <span>All Mobile Projects</span>
          </NavLink>

          {currentProjectId && (
            <NavLink
              to={`/app/projects/${currentProjectId}/settings`}
              className={({ isActive }) => `meta-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="meta-nav-icon">⚙️</span>
              <span>Project Settings</span>
            </NavLink>
          )}
        </nav>

        {/* Sidebar Footer Status */}
        <div className="meta-sidebar-footer">
          <div className="meta-api-status">
            <span className={`status-dot ${apiOnline ? 'online' : 'offline'}`} />
            <span>Core API: {apiOnline ? 'Operational (8080)' : 'Disconnected'}</span>
          </div>
          <div className="meta-user-card">
            <div className="meta-user-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="meta-user-details">
              <div className="meta-user-email" title={user?.email}>{user?.email || 'Authenticated User'}</div>
              <div className="meta-user-role">{user?.role || 'MEMBER'}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="meta-signout-btn"
              title="Sign Out of Console"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="meta-main-content">
        {/* Top Navbar */}
        <header className="meta-topbar">
          <div className="meta-topbar-left">
            <button
              className="meta-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>

            {/* Breadcrumbs */}
            <div className="meta-breadcrumbs">
              {pathParts.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="meta-crumb-divider">/</span>}
                  <span className={`meta-crumb ${index === pathParts.length - 1 ? 'current' : ''}`}>
                    {getBreadcrumbName(part)}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="meta-topbar-right">
            {/* Project Switcher Dropdown */}
            {projects.length > 0 && (
              <div className="meta-project-switcher">
                <span className="meta-switcher-label">Target App:</span>
                <select
                  value={currentProjectId}
                  onChange={handleProjectSelect}
                  className="meta-switcher-select"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      📱 {p.name}
                    </option>
                  ))}
                  <option value="__NEW__">➕ Create New Project...</option>
                </select>
              </div>
            )}

            <button
              onClick={() => refreshProjects()}
              className="btn btn-secondary btn-sm"
              title="Refresh project metrics & data"
            >
              ↻ Sync
            </button>

            <Link
              to="/"
              className="btn btn-outline btn-sm"
              title="Back to Landing Page"
            >
              🌐 Home
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="meta-page-body">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="meta-sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
