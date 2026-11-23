import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';
import AppVersionsPage from './pages/AppVersionsPage';
import TestCasesPage from './pages/TestCasesPage';
import SecurityScansPage from './pages/SecurityScansPage';
import FindingsPage from './pages/FindingsPage';
import HealingPage from './pages/HealingPage';
import ProjectSettingsPage from './pages/ProjectSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import AppShell from './components/Layout/AppShell';

/**
 * Route protector checking JWT authentication state
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--meta-bg-base)',
        color: 'var(--meta-cyan)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="meta-spinner" />
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppShell />;
}

export default function App() {
  return (
    <Routes>
      {/* 1. Public Marketing Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Standalone MetaDefender Authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* 3. Authenticated Control Plane Shell */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/app/projects" replace />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/:projectId/dashboard" element={<ProjectDashboardPage />} />
        <Route path="projects/:projectId/versions" element={<AppVersionsPage />} />
        <Route path="projects/:projectId/test-cases" element={<TestCasesPage />} />
        <Route path="projects/:projectId/scans" element={<SecurityScansPage />} />
        <Route path="projects/:projectId/findings" element={<FindingsPage />} />
        <Route path="projects/:projectId/healing" element={<HealingPage />} />
        <Route path="projects/:projectId/settings" element={<ProjectSettingsPage />} />
      </Route>

      {/* 4. Legacy redirect fallback */}
      <Route path="/projects/*" element={<Navigate to="/app/projects" replace />} />

      {/* 5. 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
