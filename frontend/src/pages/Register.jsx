import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
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
          <h2 className="auth-title">Join Our Community!</h2>
          <p className="auth-subtitle">Create your account to start sharing recipes</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <div className="auth-input-group">
            <input
              type="text"
              required
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="auth-input"
            />
            <span className="auth-input-icon">👤</span>
          </div>
          
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
              minLength="6"
              placeholder="Password (min 6 characters)"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-link">
            <Link to="/login">
              Already have an account? <strong>Sign in</strong>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;