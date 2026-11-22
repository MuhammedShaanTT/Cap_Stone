import { request, getAuthToken } from './api';

export const qualityService = {
  async runQualityAnalysis(projectId) {
    return await request(`/projects/${projectId}/run-quality-analysis`, {
      method: 'POST'
    });
  },

  async uploadApk(projectId, versionId, file, versionName) {
    const formData = new FormData();
    formData.append('file', file);
    if (versionName) {
      formData.append('version', versionName);
    }

    const token = getAuthToken();
    // Use direct upload if no versionId specified, otherwise upload to specific version
    const url = versionId && versionId !== 'auto'
      ? `/api/v1/projects/${projectId}/app-versions/${versionId}/upload`
      : `/api/v1/projects/${projectId}/app-versions/upload`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!response.ok) {
      let errText = `Upload failed with status: ${response.status}`;
      try {
        const errJson = await response.json();
        errText = errJson.message || errJson.error || errText;
      } catch (_) {}
      throw new Error(errText);
    }
    return await response.json();
  }
};
