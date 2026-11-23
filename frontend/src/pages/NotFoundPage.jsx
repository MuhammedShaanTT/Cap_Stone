import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '460px',
        background: 'var(--meta-bg-card)',
        border: '1px solid var(--meta-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧭</div>
        <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>404 — Page Not Found</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--meta-text-muted)', marginBottom: '1.5rem' }}>
          The requested console view or route does not exist or has been relocated.
        </p>
        <Link to="/app/projects" className="btn btn-primary">
          Back to Central Management &rarr;
        </Link>
      </div>
    </div>
  );
}
