import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-f">f</span>oodstaGram
          </div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue your culinary journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <div className="auth-input-group">
            <input
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="auth-input"
            />
            <span className="auth-input-icon">📧</span>
          </div>
          
          <div className="auth-input-group">
            <input
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="auth-input"
            />
            <span className="auth-input-icon">🔒</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-link">
            <Link to="/register">
              Don't have an account? <strong>Sign up</strong>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;