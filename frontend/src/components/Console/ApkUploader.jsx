import React, { useState } from 'react';
import { qualityService } from '../../services/qualityService';

export default function ApkUploader({ projectId, appVersions, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [versionTarget, setVersionTarget] = useState('auto'); // 'auto' or specific versionId
  const [customVersionName, setCustomVersionName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setUploadResult(null);
      setError(null);
      // Auto-suggest version name from file name if none selected
      if (!customVersionName) {
        const cleanName = selected.name.replace(/\.apk$/i, '');
        setCustomVersionName(cleanName);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an APK file to upload.');
      return;
    }
    if (!projectId) {
      alert('Please select a mobile project first.');
      return;
    }

    setUploading(true);
    setUploadResult(null);
    setError(null);

    try {
      const res = await qualityService.uploadApk(
        projectId,
        versionTarget,
        file,
        customVersionName || undefined
      );

      const checksum = res.sha256Checksum || res.checksum || 'Computed';
      const sizeStr = res.fileSizeBytes
        ? (res.fileSizeBytes > 1024 * 1024
            ? (res.fileSizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
            : (res.fileSizeBytes / 1024).toFixed(1) + ' KB')
        : `${file.size} bytes`;

      setUploadResult({
        filename: file.name,
        version: res.version,
        checksum: checksum,
        size: sizeStr,
        versionId: res.id
      });

      // Clear input
      setFile(null);
      setCustomVersionName('');

      // Notify parent to refresh versions and metrics
      if (onUploadSuccess) {
        onUploadSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload APK file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="console-card">
      <div className="console-card-title">
        <span>📦 Mobile Binary Artifact Uploader</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>
        Upload Android APK binaries (e.g. <code className="code-inline">test-data/defect-test-app.apk</code>).
        Files are automatically indexed with SHA-256 integrity hashes and linked to the active project.
      </p>

      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Version Target Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Target App Version:
          </label>
          <select
            value={versionTarget}
            onChange={e => setVersionTarget(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '6px',
              padding: '0.5rem 0.75rem',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            <option value="auto">✨ Create New App Version Automatically</option>
            {appVersions && appVersions.map(v => (
              <option key={v.id} value={v.id}>
                Attach to existing: {v.version} ({v.platform})
              </option>
            ))}
          </select>
        </div>

        {/* Custom Version Label (optional) */}
        {versionTarget === 'auto' && (
          <div>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Version Label (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. 1.0.0, 2.0.0, defect-test-app"
              value={customVersionName}
              onChange={e => setCustomVersionName(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>
        )}

        {/* File Picker */}
        <div style={{
          background: '#0f172a',
          border: '1px dashed #475569',
          borderRadius: '8px',
          padding: '1.25rem',
          textAlign: 'center'
        }}>
          <input
            type="file"
            id="apk-file-input"
            accept=".apk"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="apk-file-input"
            style={{
              display: 'inline-block',
              cursor: 'pointer',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}
          >
            {file ? `📁 Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : '📂 Click to Select .APK File (or defect-test-app.apk)'}
          </label>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
            Supported: Android Application Packages (.apk)
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="btn btn-sauce"
          style={{ width: '100%' }}
        >
          {uploading ? '⚡ Uploading & Computing SHA-256...' : (file ? `Upload "${file.name}" to Project` : 'Choose File to Upload')}
        </button>
      </form>

      {/* Success Banner */}
      {uploadResult && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '0.85rem',
          borderRadius: '8px',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>✅</span>
            <span>APK Binary Successfully Uploaded & Reflected in Project!</span>
          </div>
          <div style={{ color: '#fff', fontSize: '0.78rem', lineHeight: 1.5 }}>
            <div><strong>Version:</strong> {uploadResult.version}</div>
            <div><strong>File:</strong> {uploadResult.filename} ({uploadResult.size})</div>
            <div style={{ wordBreak: 'break-all' }}>
              <strong>SHA-256:</strong> <code style={{ color: '#38bdf8' }}>{uploadResult.checksum}</code>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.75rem',
          borderRadius: '6px',
          fontSize: '0.82rem'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
