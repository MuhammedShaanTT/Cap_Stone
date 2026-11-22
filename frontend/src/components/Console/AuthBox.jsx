import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function AuthBox({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickLogin = async (userEmail) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(userEmail, 'password123');
      onAuthenticated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      onAuthenticated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto', textAlign: 'center' }}>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
        Access Quality Platform Console
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Connect to your running backend at <code className="code-inline">http://localhost:8080</code>
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Quick 1-Click Demo Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleQuickLogin('admin@example.com')}
          disabled={loading}
          className="btn btn-sauce"
          style={{ width: '100%' }}
        >
          {loading ? 'Authenticating...' : '⚡ Quick Sign In as Demo Admin (admin@example.com)'}
        </button>
        <button
          onClick={() => handleQuickLogin('developer@example.com')}
          disabled={loading}
          className="btn btn-outline"
          style={{ width: '100%', color: '#fff', borderColor: '#475569' }}
        >
          Sign In as Developer (developer@example.com)
        </button>
      </div>

      <div style={{ position: 'relative', margin: '1.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>
        <span>OR ENTER CREDENTIALS</span>
      </div>

      <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            background: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            background: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn btn-dark"
          style={{ width: '100%', border: '1px solid #475569' }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
