import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { notifySuccess, notifyError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/app/projects';

  const handleQuickSignIn = async (demoEmail) => {
    setErrorMsg('');
    try {
      await login(demoEmail, 'password123');
      notifySuccess(`Signed in as ${demoEmail}`, 'Authentication Successful');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.message || 'Failed to authenticate demo user';
      setErrorMsg(msg);
      notifyError(msg, 'Sign In Failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');

    try {
      await login(email.trim(), password);
      notifySuccess(`Welcome back, ${email}`, 'Sign In Successful');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let msg = err.message || 'Invalid credentials or connection error.';
      if (msg.includes('401')) {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (msg.includes('403')) {
        msg = 'Access denied. Account may be locked or inactive.';
      }
      setErrorMsg(msg);
      notifyError(msg, 'Authentication Error');
    }
  };

  return (
    <div className="meta-login-page">
      <div className="meta-login-background-glow" />

      <div className="meta-login-card">
        {/* Brand Header */}
        <div className="meta-login-header">
          <Link to="/" className="meta-login-brand">
            <div className="meta-login-brand-icon">🛡️</div>
            <span>AURA<span className="accent">.</span>QA</span>
          </Link>
          <div className="meta-login-tagline">
            MetaDefender Mobile Quality & Zero-Trust Cloud Platform
          </div>
        </div>

        {/* 1-Click Demo Environment Credentials */}
        <div className="meta-demo-box">
          <div className="meta-demo-title">
            <span>🧪</span> DEMO ENVIRONMENT ONE-CLICK ACCESS
          </div>
          <div className="meta-demo-buttons">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickSignIn('admin@example.com')}
              className="meta-demo-btn meta-demo-admin"
            >
              <span>⚡ Admin Demo</span>
              <span className="meta-demo-sub">admin@example.com</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickSignIn('developer@example.com')}
              className="meta-demo-btn meta-demo-dev"
            >
              <span>👤 Developer Demo</span>
              <span className="meta-demo-sub">developer@example.com</span>
            </button>
          </div>
        </div>

        <div className="meta-login-divider">
          <span>OR ENTER CREDENTIALS</span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="meta-login-error" role="alert">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="meta-login-form">
          <div className="meta-form-group">
            <label htmlFor="login-email">Corporate Email Address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@example.com"
              required
              disabled={loading}
              className="meta-input"
            />
          </div>

          <div className="meta-form-group">
            <div className="meta-label-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="meta-pwd-toggle"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading}
              className="meta-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Console →'}
          </button>
        </form>

        <div className="meta-login-footer">
          <Link to="/" className="meta-back-link">
            ← Back to Public Overview
          </Link>
          <span className="meta-footer-note">
            Targeting backend: <code className="code-font">http://localhost:8080</code>
          </span>
        </div>
      </div>
    </div>
  );
}
