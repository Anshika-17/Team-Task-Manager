import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div style={{ padding: '32px' }}>Loading...</div>;

  return (
    <div className="main-content">
      <h2>Welcome, {user?.name}</h2>
      <p className="text-muted mb-4">Here's what's happening with your projects today.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div className="glass-card">
          <h3 className="text-muted">Total Projects</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>{stats.total_projects}</h1>
        </div>
        <div className="glass-card">
          <h3 className="text-muted">Tasks To Do</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--warning-color)' }}>{stats.todo}</h1>
        </div>
        <div className="glass-card">
          <h3 className="text-muted">In Progress</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>{stats.in_progress}</h1>
        </div>
        <div className="glass-card">
          <h3 className="text-muted">Completed</h3>
          <h1 style={{ fontSize: '3rem', color: 'var(--success-color)' }}>{stats.done}</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
