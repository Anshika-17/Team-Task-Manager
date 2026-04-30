import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee_id: '', due_date: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/projects/${id}/tasks`);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask };
      if (!payload.assignee_id) delete payload.assignee_id;
      if (!payload.due_date) delete payload.due_date;
      await api.post(`/projects/${id}/tasks`, payload);
      setNewTask({ title: '', description: '', assignee_id: '', due_date: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editingTask };
      if (!payload.assignee_id) payload.assignee_id = null;
      if (!payload.due_date) payload.due_date = null;
      
      const updatePayload = {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        due_date: payload.due_date,
        assignee_id: payload.assignee_id,
      };
      await api.put(`/tasks/${editingTask.id}`, updatePayload);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const TaskColumn = ({ title, tasks, status }) => (
    <div style={{ flex: 1, minWidth: '300px' }} className="glass-panel">
      <h3 className="mb-4">{title} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({tasks.length})</span></h3>
      <div className="flex-col gap-4">
        {tasks.map(t => (
          <div key={t.id} className="glass-card">
            <h4>{t.title}</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: '8px 0' }}>{t.description}</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '4px' }}>
              Assignee: {t.assignee ? t.assignee.name : 'Unassigned'}
            </div>
            {t.due_date && (
              <div style={{ fontSize: '0.8rem', color: new Date(t.due_date) < new Date() && t.status !== 'Done' ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                Due: {t.due_date} {new Date(t.due_date) < new Date() && t.status !== 'Done' && '(Overdue)'}
              </div>
            )}
            
            {(user?.id === project?.owner_id || user?.role === 'admin') && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  {status !== 'Todo' && (
                    <button onClick={() => updateTaskStatus(t.id, 'Todo')} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>To Do</button>
                  )}
                  {status !== 'In Progress' && (
                    <button onClick={() => updateTaskStatus(t.id, 'In Progress')} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--primary-color)', color: 'white' }}>In Progress</button>
                  )}
                  {status !== 'Done' && (
                    <button onClick={() => updateTaskStatus(t.id, 'Done')} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--success-color)', color: 'white' }}>Done</button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingTask({
                        id: t.id,
                        title: t.title,
                        description: t.description || '',
                        status: t.status,
                        due_date: t.due_date || '',
                        assignee_id: t.assignee_id || ''
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>Edit</button>
                  <button onClick={() => deleteTask(t.id)} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--danger-color)', color: 'white' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>No tasks in this column.</p>}
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="flex justify-between items-center mb-4">
        <h2>{project ? project.name : 'Project Board'}</h2>
      </div>

      {(user?.id === project?.owner_id || user?.role === 'admin') && (
        <div className="glass-panel mb-4">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="flex-col gap-4 mt-4">
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Task Title" 
                value={editingTask ? editingTask.title : newTask.title} 
                onChange={e => editingTask ? setEditingTask({...editingTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Description" 
                value={editingTask ? editingTask.description : newTask.description} 
                onChange={e => editingTask ? setEditingTask({...editingTask, description: e.target.value}) : setNewTask({...newTask, description: e.target.value})} 
              />
            </div>
            <div className="flex gap-4 items-center">
              <select value={editingTask ? editingTask.assignee_id : newTask.assignee_id} onChange={e => editingTask ? setEditingTask({...editingTask, assignee_id: e.target.value}) : setNewTask({...newTask, assignee_id: e.target.value})}>
                <option value="">Assign to (Self)</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
              <input 
                type="date" 
                value={editingTask ? editingTask.due_date : newTask.due_date} 
                onChange={e => editingTask ? setEditingTask({...editingTask, due_date: e.target.value}) : setNewTask({...newTask, due_date: e.target.value})} 
              />
              <button type="submit" className="primary" style={{ whiteSpace: 'nowrap' }}>{editingTask ? 'Update Task' : 'Add Task'}</button>
              {editingTask && (
                <button type="button" onClick={() => setEditingTask(null)} style={{ background: 'var(--surface-color)', color: 'var(--text-primary)' }}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-4 mt-4" style={{ overflowX: 'auto', paddingBottom: '16px' }}>
        <TaskColumn title="To Do" tasks={todoTasks} status="Todo" />
        <TaskColumn title="In Progress" tasks={inProgressTasks} status="In Progress" />
        <TaskColumn title="Done" tasks={doneTasks} status="Done" />
      </div>
    </div>
  );
};

export default ProjectDetails;
