import React, { useState } from 'react';
import { authService } from '../../services/authService';

export default function AuthBox({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        Sign in to Aura Quality Console
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Use an authorized workspace account.
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

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
