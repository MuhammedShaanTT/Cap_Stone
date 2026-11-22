/**
 * Centralized API Client with JWT Bearer Token Injection
 */

const API_BASE_URL = '/api/v1';

export function getAuthToken() {
  return localStorage.getItem('aura_auth_token') || localStorage.getItem('maqp_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('aura_auth_token', token);
    localStorage.setItem('maqp_token', token);
  } else {
    localStorage.removeItem('aura_auth_token');
    localStorage.removeItem('maqp_token');
  }
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is plain object and not FormData, stringify to JSON
  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      setAuthToken(null);
      localStorage.removeItem('aura_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('aura:session-expired'));
      }
    }
    let errorDetail = response.statusText;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch (_) {}
    throw new Error(`API Error [${response.status}]: ${errorDetail}`);
  }

  // Handle empty or 204 responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}
