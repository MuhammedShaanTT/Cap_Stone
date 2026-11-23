import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import './ProjectSettingsPage.css';

export default function ProjectSettingsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { activeProject } = useProject();
  const { notifySuccess, notifyInfo } = useToast();

  const [name, setName] = useState(activeProject?.name || '');
  const [desc, setDesc] = useState(activeProject?.description || '');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      notifySuccess('Project configuration updated', 'Settings Saved');
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to archive or remove "${activeProject?.name}"?`)) {
      notifyInfo('Project archived.');
      navigate('/app/projects');
    }
  };

  return (
    <div className="meta-settings-page">
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">Project Configuration & Policy</h1>
          <p className="meta-page-sub">
            Manage target metadata, OWASP release compliance policies, and team access.
          </p>
        </div>
      </div>

      <div className="meta-settings-card">
        <h3 className="meta-settings-section-title">General Project Details</h3>
        <form onSubmit={handleSave} className="meta-settings-form">
          <div className="meta-form-group">
            <label>Project ID</label>
            <input
              type="text"
              value={projectId}
              disabled
              className="meta-input code-font"
            />
          </div>

          <div className="meta-form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="meta-input"
              required
            />
          </div>

          <div className="meta-form-group">
            <label>Description & Scope</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="meta-input"
            />
          </div>

          <div>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Configuration Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="meta-settings-card meta-danger-zone">
        <h3 className="meta-settings-section-title" style={{ color: 'var(--verdict-threat)' }}>
          Danger Zone
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--meta-text-muted)', marginBottom: '1rem' }}>
          Deleting or archiving this project will disassociate historical SAST scans and synthesized test suites.
        </p>
        <button onClick={handleDelete} className="btn btn-danger">
          Archive or Remove Project
        </button>
      </div>
    </div>
  );
}
