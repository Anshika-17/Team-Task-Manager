import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-4">
        <h2>Projects</h2>
      </div>

      <div className="glass-panel mb-4">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreate} className="flex gap-4 mt-4 items-center">
          <input 
            type="text" 
            placeholder="Project Name" 
            value={newProject.name} 
            onChange={e => setNewProject({...newProject, name: e.target.value})} 
            required 
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={newProject.description} 
            onChange={e => setNewProject({...newProject, description: e.target.value})} 
          />
          <button type="submit" className="primary" style={{ whiteSpace: 'nowrap' }}>Create Project</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {projects.map(p => (
          <Link to={`/projects/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
            <div className="glass-card h-100 flex-col justify-between" style={{ height: '100%' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="text-muted mt-2">{p.description}</p>
              </div>
              <div className="mt-4">
                <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--surface-color)', borderRadius: '4px', color: 'var(--text-secondary)' }}>View Project Board &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
