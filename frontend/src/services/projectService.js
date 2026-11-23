import { request } from './api';

export const projectService = {
  async getProjects() {
    return await request('/projects', { method: 'GET' });
  },

  async getProject(projectId) {
    return await request(`/projects/${projectId}`, { method: 'GET' });
  },

  async createProject(name, description) {
    return await request('/projects', {
      method: 'POST',
      body: { name, description }
    });
  },

  async getDashboard(projectId) {
    return await request(`/projects/${projectId}/dashboard`, { method: 'GET' });
  },

  async getAppVersions(projectId) {
    return await request(`/projects/${projectId}/app-versions`, { method: 'GET' });
  },

  async createAppVersion(projectId, version, platform = 'ANDROID', packageName = 'com.example.calculator') {
    return await request(`/projects/${projectId}/app-versions`, {
      method: 'POST',
      body: { version, platform, packageName }
    });
  },

  async getTestCases(projectId) {
    return await request(`/projects/${projectId}/test-cases`, { method: 'GET' });
  },

  async createTestCase(projectId, testCaseData) {
    return await request(`/projects/${projectId}/test-cases`, {
      method: 'POST',
      body: testCaseData
    });
  },

  async getSecurityScans(projectId) {
    return await request(`/projects/${projectId}/security-scans`, { method: 'GET' });
  },

  async createSecurityScan(projectId, scanData = {}) {
    return await request(`/projects/${projectId}/security-scans`, {
      method: 'POST',
      body: scanData
    });
  },

  async getPipelineRuns(projectId) {
    return await request(`/projects/${projectId}/pipeline-runs`, { method: 'GET' });
  },

  async createPipelineRun(projectId, branch = 'main', commitSha = 'HEAD') {
    return await request(`/projects/${projectId}/pipeline-runs`, {
      method: 'POST',
      body: { branch, commitSha }
    });
  },

  async getTestRuns(testCaseId) {
    return await request(`/test-cases/${testCaseId}/test-runs`, { method: 'GET' });
  },

  async createTestRun(testCaseId, runData = {}) {
    return await request(`/test-cases/${testCaseId}/test-runs`, {
      method: 'POST',
      body: runData
    });
  }
};
