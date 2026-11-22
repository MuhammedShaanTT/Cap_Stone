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
  }
};
