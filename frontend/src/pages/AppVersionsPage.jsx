import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { qualityService } from '../services/qualityService';
import { useToast } from '../context/ToastContext';
import AiPlanViewer from '../components/Console/AiPlanViewer';
import './AppVersionsPage.css';

export default function AppVersionsPage() {
  const { projectId } = useParams();
  const { notifySuccess, notifyError, notifyInfo } = useToast();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  // File Upload Dropzone State
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [versionTarget, setVersionTarget] = useState('auto');
  const [customVersionTag, setCustomVersionTag] = useState('');
  const [autoAiPlan, setAutoAiPlan] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccessResult, setUploadSuccessResult] = useState(null);

  // AI Plan State
  const [aiPlanResult, setAiPlanResult] = useState(null);
  const [generatingAiPlan, setGeneratingAiPlan] = useState(false);

  // New Version Tag Modal
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Copy Tooltip state
  const [copiedHash, setCopiedHash] = useState(null);
  const fileInputRef = useRef(null);

  const fetchVersions = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await projectService.getAppVersions(projectId);
      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      notifyError(err.message || 'Could not load app versions');
    } finally {
      setLoading(false);
    }
  }, [projectId, notifyError]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.apk')) {
      notifyError('Invalid file type. Only Android APK binaries (.apk) are supported.', 'File Rejected');
      return;
    }
    // Max 500MB
    if (file.size > 500 * 1024 * 1024) {
      notifyError('File exceeds maximum supported threshold of 500MB.', 'File Too Large');
      return;
    }

    setSelectedFile(file);
    setUploadSuccessResult(null);
    setAiPlanResult(null);

    // Auto-fill version tag if empty
    if (!customVersionTag) {
      const cleanName = file.name.replace(/\.apk$/i, '');
      setCustomVersionTag(cleanName);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Trigger Gemini AI plan generation
  const runAiPlan = async (versionId) => {
    if (!projectId || !versionId) return;
    setGeneratingAiPlan(true);
    notifyInfo('Invoking Google Gemini 2.5 Flash to synthesize executive test plan & Appium test cases...', 'AI Synthesis');
    try {
      const plan = await qualityService.generateAiTestPlan(projectId, versionId);
      setAiPlanResult(plan);
      notifySuccess(`Synthesized ${plan.persistedTestCasesCount || 'multiple'} test cases into repository!`, 'AI Plan Ready');
    } catch (err) {
      notifyError(err.message || 'Failed to synthesize AI test plan');
    } finally {
      setGeneratingAiPlan(false);
    }
  };

  // Upload handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      notifyError('Please drop or select an APK binary first.');
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

    try {
      const res = await qualityService.uploadApk(
        projectId,
        versionTarget,
        selectedFile,
        customVersionTag || undefined
      );

      clearInterval(progressTimer);
      setUploadProgress(100);

      const checksum = res.sha256Checksum || res.checksum || 'Computed';
      const sizeStr = res.fileSizeBytes
        ? (res.fileSizeBytes > 1024 * 1024
            ? (res.fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
            : (res.fileSizeBytes / 1024).toFixed(1) + ' KB')
        : `${(selectedFile.size / 1024).toFixed(1)} KB`;

      setUploadSuccessResult({
        filename: selectedFile.name,
        version: res.version,
        checksum,
        size: sizeStr,
        versionId: res.id
      });

      notifySuccess(`Uploaded "${selectedFile.name}" (SHA-256 Verified)`, 'Artifact Ingested');
      setSelectedFile(null);
      setCustomVersionTag('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      await fetchVersions();

      if (autoAiPlan && res.id) {
        await runAiPlan(res.id);
      }
    } catch (err) {
      clearInterval(progressTimer);
      notifyError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Copy SHA-256 to clipboard
  const handleCopySha = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    notifyInfo('SHA-256 hash copied to clipboard');
    setTimeout(() => setCopiedHash(null), 3000);
  };

  // Create Tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    try {
      await projectService.createAppVersion(projectId, newTagInput.trim());
      notifySuccess(`Registered version tag "${newTagInput.trim()}"`);
      setNewTagInput('');
      setShowAddTagModal(false);
      await fetchVersions();
    } catch (err) {
      notifyError(err.message || 'Could not register version tag');
    }
  };

  return (
    <div className="meta-versions-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">Binary Dropzone & Artifact Integrity</h1>
          <p className="meta-page-sub">
            MetaDefender-style zero-trust mobile binary ingestion. Upload Android APK files for automated SHA-256 hashing and Gemini 2.5 Flash quality synthesis.
          </p>
        </div>
        <div className="meta-header-actions">
          <button
            onClick={() => setShowAddTagModal(true)}
            className="btn btn-secondary"
          >
            ➕ Add Version Tag
          </button>
        </div>
      </div>

      {/* METADEFENDER DRAG & DROP ZONE */}
      <div className="meta-dropzone-card">
        <div className="meta-dropzone-header">
          <div className="meta-dropzone-title">
            <span>🛡️</span> MetaDefender File Inspection Dropzone
          </div>
          <span className="pill pill-clean">ZERO-TRUST VERIFICATION</span>
        </div>

        <form onSubmit={handleUploadSubmit}>
          {/* Target Version Selector */}
          <div className="meta-dropzone-config-row">
            <div className="meta-dropzone-field">
              <label>Target Version Container:</label>
              <select
                value={versionTarget}
                onChange={(e) => setVersionTarget(e.target.value)}
                className="meta-input"
              >
                <option value="auto">✨ Auto-Create Version Container From APK</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Attach to: v{v.version} ({v.platform})
                  </option>
                ))}
              </select>
            </div>

            {versionTarget === 'auto' && (
              <div className="meta-dropzone-field">
                <label>Custom Version Tag (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. 2.1.0-release or defect-test-app"
                  value={customVersionTag}
                  onChange={(e) => setCustomVersionTag(e.target.value)}
                  className="meta-input"
                />
              </div>
            )}
          </div>

          {/* Interactive Drag & Drop Box */}
          <div
            className={`meta-drop-target ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <div className="meta-drop-icon">
              {selectedFile ? '📦' : '📂'}
            </div>
            <div className="meta-drop-prompt">
              {selectedFile ? (
                <>
                  <strong style={{ color: 'var(--meta-cyan)' }}>{selectedFile.name}</strong>
                  <span className="meta-drop-sub">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for ingestion
                  </span>
                </>
              ) : (
                <>
                  <strong>Drag & drop Android APK file here</strong>
                  <span className="meta-drop-sub">
                    or click to browse from Downloads &bull; Maximum file size: 500 MB
                  </span>
                </>
              )}
            </div>
          </div>

          {/* AI Auto-generate Toggle */}
          <div className="meta-ai-toggle-box">
            <label className="meta-checkbox-label">
              <input
                type="checkbox"
                checked={autoAiPlan}
                onChange={(e) => setAutoAiPlan(e.target.checked)}
              />
              <span>
                🧠 <strong>Synthesize AI Test Plan & Appium Test Cases with Gemini 2.5 Flash</strong> immediately after upload
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="meta-dropzone-action-bar">
            {selectedFile && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn btn-outline"
                disabled={uploading}
              >
                ✕ Cancel Selection
              </button>
            )}
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {uploading ? `Ingesting & Hashing... (${uploadProgress}%)` : selectedFile ? `Upload "${selectedFile.name}"` : 'Select APK to Ingest'}
            </button>
          </div>
        </form>

        {/* Upload Success Banner */}
        {uploadSuccessResult && (
          <div className="meta-upload-success-card">
            <div className="meta-success-head">
              <div className="meta-success-title">
                <span>✅</span> Binary Verified & Uploaded
              </div>
              <button
                onClick={() => runAiPlan(uploadSuccessResult.versionId)}
                disabled={generatingAiPlan}
                className="btn btn-secondary btn-sm"
              >
                {generatingAiPlan ? 'Generating...' : '⚡ Re-synthesize AI Plan'}
              </button>
            </div>
            <div className="meta-success-details">
              <div><strong>Version:</strong> v{uploadSuccessResult.version}</div>
              <div><strong>File:</strong> {uploadSuccessResult.filename} ({uploadSuccessResult.size})</div>
              <div className="meta-sha-row">
                <strong>SHA-256:</strong>
                <code className="code-font meta-sha-code">{uploadSuccessResult.checksum}</code>
                <button
                  type="button"
                  onClick={() => handleCopySha(uploadSuccessResult.checksum)}
                  className="meta-copy-btn"
                  title="Copy SHA-256"
                >
                  {copiedHash === uploadSuccessResult.checksum ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gemini AI Plan Viewer Component */}
      {generatingAiPlan && (
        <div className="meta-generating-loader">
          <div className="meta-spinner" />
          <div style={{ fontWeight: 700, color: 'var(--meta-cyan)' }}>
            Google Gemini 2.5 Flash is analyzing your mobile application...
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--meta-text-muted)', marginTop: '4px' }}>
            Synthesizing test strategy, device matrix, Appium-ready locators, and security recommendations.
          </div>
        </div>
      )}

      {aiPlanResult && (
        <AiPlanViewer
          planData={aiPlanResult}
          onClose={() => setAiPlanResult(null)}
        />
      )}

      {/* VERSIONS INVENTORY TABLE */}
      <div className="meta-versions-inventory-card">
        <div className="meta-inventory-header">
          <div className="meta-inventory-title">
            <span>📱</span> Registered App Versions & Binary Status ({versions.length})
          </div>
          <button onClick={fetchVersions} className="btn btn-outline btn-sm">
            ↻ Sync
          </button>
        </div>

        {loading ? (
          <div className="meta-loading-box">
            <div className="meta-spinner" />
            <div>Loading versions...</div>
          </div>
        ) : versions.length === 0 ? (
          <div className="meta-widget-empty">
            <p>No versions registered yet. Drag and drop an APK file above to register your first version.</p>
          </div>
        ) : (
          <div className="meta-table-wrap">
            <table className="meta-table">
              <thead>
                <tr>
                  <th>VERSION</th>
                  <th>PLATFORM</th>
                  <th>PACKAGE NAME</th>
                  <th>BINARY STATUS</th>
                  <th>INTEGRITY / SHA-256</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => {
                  const hasBinary = Boolean(v.checksum || v.artifactRef);
                  const sizeDisplay = v.fileSizeBytes
                    ? (v.fileSizeBytes > 1024 * 1024
                        ? (v.fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
                        : (v.fileSizeBytes / 1024).toFixed(1) + ' KB')
                    : null;

                  return (
                    <tr key={v.id}>
                      <td>
                        <strong className="meta-table-version">v{v.version}</strong>
                      </td>
                      <td>
                        <span className="pill pill-info">{v.platform || 'ANDROID'}</span>
                      </td>
                      <td>
                        <code className="code-font meta-pkg-name">
                          {v.packageName || 'com.example.calculator'}
                        </code>
                      </td>
                      <td>
                        {hasBinary ? (
                          <span className="pill pill-clean">
                            🟢 READY {sizeDisplay && `(${sizeDisplay})`}
                          </span>
                        ) : (
                          <span className="pill pill-warning">🟡 NO BINARY</span>
                        )}
                      </td>
                      <td>
                        {v.checksum ? (
                          <div className="meta-table-sha-wrap">
                            <code className="code-font meta-sha-short">
                              {v.checksum.substring(0, 12)}...
                            </code>
                            <button
                              onClick={() => handleCopySha(v.checksum)}
                              className="meta-copy-icon-btn"
                              title="Copy SHA-256 hash"
                            >
                              📋
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--meta-text-dim)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => runAiPlan(v.id)}
                          className="btn btn-secondary btn-sm"
                          disabled={generatingAiPlan}
                        >
                          🧠 AI Plan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Version Tag Modal */}
      {showAddTagModal && (
        <div className="meta-modal-overlay" onClick={() => setShowAddTagModal(false)}>
          <div className="meta-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="meta-modal-header">
              <div className="meta-modal-title">
                <span>🏷️</span> Add Version Tag
              </div>
              <button className="meta-modal-close" onClick={() => setShowAddTagModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTag} className="meta-modal-form">
              <div className="meta-form-group">
                <label>Version Label *</label>
                <input
                  type="text"
                  placeholder="e.g. 2.1.0, 3.0.0-rc1"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  required
                  autoFocus
                  className="meta-input"
                />
              </div>
              <div className="meta-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddTagModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Version Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
