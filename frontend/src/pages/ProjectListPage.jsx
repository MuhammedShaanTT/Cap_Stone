import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import './ProjectListPage.css';

export default function ProjectListPage() {
  const { projects, loading, createProject, refreshProjects, setActiveProject } = useProject();
  const { notifySuccess, notifyError } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Auto-open create modal if ?create=true in URL
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const handleOpenProject = (project) => {
    setActiveProject(project);
    navigate(`/app/projects/${project.id}/dashboard`);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      const created = await createProject(newProjectName.trim(), newProjectDesc.trim());
      notifySuccess(`Project "${newProjectName}" created successfully!`, 'Project Created');
      setShowCreateModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      setSearchParams({});
      if (created?.id) {
        navigate(`/app/projects/${created.id}/dashboard`);
      }
    } catch (err) {
      notifyError(err.message || 'Failed to create project', 'Creation Error');
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="meta-projects-page">
      {/* Page Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">Central Management: Mobile Projects</h1>
          <p className="meta-page-sub">
            Unified inventory of protected mobile applications, threat assessments, and automated test repositories.
          </p>
        </div>
        <div className="meta-header-actions">
          <button
            onClick={() => refreshProjects()}
            className="btn btn-secondary"
            title="Reload projects list"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            ➕ Register New Mobile App
          </button>
        </div>
      </div>

      {/* Onboarding Banner / Quick Overview */}
      <div className="meta-onboarding-card">
        <div className="meta-onboarding-icon">🚀</div>
        <div className="meta-onboarding-text">
          <div className="meta-onboarding-title">Getting Started with MetaDefender Quality Platform</div>
          <div className="meta-onboarding-desc">
            1. Register a mobile project &rarr; 2. Drop in your Android APK binary in the Dropzone &rarr; 3. Run automated SAST analysis & synthesize AI test suites with Google Gemini 2.5 Flash!
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="meta-filter-bar">
        <div className="meta-search-input-wrap">
          <span className="meta-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search projects by name, description, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="meta-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="meta-search-clear"
            >
              ✕
            </button>
          )}
        </div>
        <div className="meta-project-count-badge">
          Total Apps: <strong>{projects.length}</strong>
        </div>
      </div>

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="meta-loading-box">
          <div className="meta-spinner" />
          <div>Connecting to Central Management catalog...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="meta-empty-state">
          <div className="meta-empty-icon">📱</div>
          <h3>{searchQuery ? 'No matching projects found' : 'No mobile projects registered yet'}</h3>
          <p>
            {searchQuery
              ? `No projects match "${searchQuery}". Try a different keyword.`
              : 'Register your first Android or iOS mobile application to begin vulnerability audits and autonomous test generation.'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            ➕ Register New App
          </button>
        </div>
      ) : (
        <div className="meta-projects-grid">
          {filteredProjects.map((p) => (
            <div key={p.id} className="meta-project-card">
              <div className="meta-card-top">
                <div className="meta-card-icon">📱</div>
                <div className="meta-card-title-group">
                  <h3 className="meta-card-title" title={p.name}>{p.name}</h3>
                  <div className="meta-card-id code-font">ID: {p.id}</div>
                </div>
                <span className="pill pill-clean">ACTIVE</span>
              </div>

              <p className="meta-card-desc">
                {p.description || 'Enterprise mobile application build configured for automated quality assessment and vulnerability scanning.'}
              </p>

              <div className="meta-card-meta-row">
                <div className="meta-card-meta-item">
                  <span className="meta-meta-label">Platform</span>
                  <span className="meta-meta-val">Android / APK</span>
                </div>
                <div className="meta-card-meta-item">
                  <span className="meta-meta-label">Audit Engine</span>
                  <span className="meta-meta-val">Gemini 2.5 + SAST</span>
                </div>
              </div>

              <div className="meta-card-actions">
                <button
                  onClick={() => handleOpenProject(p)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  ⚡ Open Console
                </button>
                <button
                  onClick={() => {
                    setActiveProject(p);
                    navigate(`/app/projects/${p.id}/versions`);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  📦 Drop APK
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal Dialog */}
      {showCreateModal && (
        <div className="meta-modal-overlay" onClick={() => !creating && setShowCreateModal(false)}>
          <div className="meta-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="meta-modal-header">
              <div className="meta-modal-title">
                <span>📱</span> Register New Mobile Application
              </div>
              <button
                className="meta-modal-close"
                onClick={() => !creating && setShowCreateModal(false)}
                disabled={creating}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="meta-modal-form">
              <div className="meta-form-group">
                <label htmlFor="proj-name">Application Name *</label>
                <input
                  id="proj-name"
                  type="text"
                  placeholder="e.g. Mobile Banking App, Calculator App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                  disabled={creating}
                  className="meta-input"
                />
              </div>

              <div className="meta-form-group">
                <label htmlFor="proj-desc">Description (Optional)</label>
                <textarea
                  id="proj-desc"
                  rows={3}
                  placeholder="Provide scope, repository link, or security classification details..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  disabled={creating}
                  className="meta-input"
                />
              </div>

              <div className="meta-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newProjectName.trim()}
                  className="btn btn-primary"
                >
                  {creating ? 'Registering...' : 'Register Application →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
