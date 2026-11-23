import { request, setAuthToken, getAuthToken } from './api';

export const authService = {
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (data.accessToken) {
      setAuthToken(data.accessToken);
      localStorage.setItem('aura_user', JSON.stringify(
        data.user || { email, role: 'DEVELOPER' }
      ));
    }
    return data;
  },

  logout() {
    setAuthToken(null);
    localStorage.removeItem('aura_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('aura_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(getAuthToken());
  }
};
