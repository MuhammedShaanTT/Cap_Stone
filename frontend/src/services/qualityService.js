import { request, getAuthToken, setAuthToken } from './api';

export const qualityService = {
  async runQualityAnalysis(projectId, appVersionId = null) {
    const query = appVersionId ? `?appVersionId=${encodeURIComponent(appVersionId)}` : '';
    return await request(`/projects/${projectId}/run-quality-analysis${query}`, {
      method: 'POST'
    });
  },

  async generateAiTestPlan(projectId, versionId) {
    return await request(`/projects/${projectId}/app-versions/${versionId}/generate-ai-plan`, {
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
      if (response.status === 401 || response.status === 403) {
        setAuthToken(null);
        localStorage.removeItem('aura_user');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aura:session-expired', {
            detail: { status: response.status }
          }));
        }
      }
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
