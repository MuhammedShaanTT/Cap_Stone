import { request, setAuthToken, getAuthToken } from './api';

export const authService = {
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (data && data.accessToken) {
      setAuthToken(data.accessToken);

      // Use real backend user payload, fallback sensibly
      const userObj = data.user || {
        id: data.id || 'u-demo',
        email: email,
        displayName: email.split('@')[0],
        role: data.role || (email.toLowerCase().includes('admin') ? 'ADMIN' : 'MEMBER')
      };

      localStorage.setItem('aura_user', JSON.stringify(userObj));
      return { ...data, user: userObj };
    }
    return data;
  },

  async register(email, password, displayName = '', role = 'MEMBER') {
    const data = await request('/auth/register', {
      method: 'POST',
      body: { email, password, displayName, role }
    });

    if (data && data.accessToken) {
      setAuthToken(data.accessToken);
      const userObj = data.user || {
        id: data.id || 'u-registered',
        email,
        displayName: displayName || email.split('@')[0],
        role
      };
      localStorage.setItem('aura_user', JSON.stringify(userObj));
      return { ...data, user: userObj };
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
