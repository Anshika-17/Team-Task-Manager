import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';

const ProtectedRoute = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <div style={{ width: '250px', borderRight: '1px solid var(--surface-border)', padding: '24px', display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.4)' }}>
        <h2 style={{ color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>TaskMaster</h2>
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link to="/" style={{ padding: '12px 16px', background: location.pathname === '/' ? 'var(--primary-color)' : 'transparent', borderRadius: '8px', color: location.pathname === '/' ? 'white' : 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s ease' }}>Dashboard</Link>
          <Link to="/projects" style={{ padding: '12px 16px', background: location.pathname.startsWith('/projects') ? 'var(--primary-color)' : 'transparent', borderRadius: '8px', color: location.pathname.startsWith('/projects') ? 'white' : 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s ease' }}>Projects</Link>
        </div>
        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--surface-border)', marginTop: 'auto' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>Logout</button>
        </div>
      </div>
      {children}
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
