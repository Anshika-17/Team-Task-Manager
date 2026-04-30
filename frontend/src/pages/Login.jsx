import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      navigate('/');
    } catch (err) {
      const isTimeout = err?.code === 'ERR_NETWORK' || err?.message?.includes('timeout') || !err?.response;
      if (isTimeout) {
        setError('⏳ Server is waking up (free tier). Please wait 30 seconds and try again.');
      } else if (err?.response?.status === 400) {
        setError('Email already registered. Please sign in instead.');
      } else {
        setError(isLogin ? 'Invalid email or password.' : 'Error creating account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container items-center" style={{ justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="flex-col gap-4 mt-4">
          {!isLogin && (
            <div>
              <label className="text-muted mb-2" style={{ display: 'block' }}>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
                required={!isLogin} 
              />
            </div>
          )}
          <div>
            <label className="text-muted mb-2" style={{ display: 'block' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com"
              required 
            />
          </div>
          <div>
            <label className="text-muted mb-2" style={{ display: 'block' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="primary mt-4" disabled={loading}>
            {loading ? '⏳ Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                style={{ background: 'transparent', padding: 0, color: 'var(--primary-color)' }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
