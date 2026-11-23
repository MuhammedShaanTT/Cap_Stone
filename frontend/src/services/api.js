/**
 * Centralized MetaDefender-Style API Client with JWT Bearer Token Injection,
 * Request Timeout, Retry Logic, and Centralized 401/403 Handling.
 */

const API_BASE_URL = '/api/v1';
const TOKEN_KEY = 'aura_auth_token';
const DEFAULT_TIMEOUT_MS = 30000;

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function request(endpoint, options = {}, retries = 1) {
  const url = endpoint.startsWith('http') || endpoint.startsWith('/api') || endpoint.startsWith('/actuator')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const token = getAuthToken();

  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is plain object and not FormData, stringify to JSON
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  // Create AbortController with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      body,
      headers,
      signal: options.signal || controller.signal
    });

    clearTimeout(timeoutId);

    // Handle session expiration
    if (response.status === 401 || response.status === 403) {
      setAuthToken(null);
      localStorage.removeItem('aura_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('aura:session-expired', {
          detail: { status: response.status, endpoint }
        }));
      }
    }

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
      } catch (_) {}
      throw new Error(`API Error [${response.status}]: ${errorDetail}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Handle JSON or text response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);

    // Auto-retry once on network failure for safe GET requests
    if (retries > 0 && (options.method === 'GET' || !options.method) && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, 800));
      return request(endpoint, options, retries - 1);
    }
    throw error;
  }
}
