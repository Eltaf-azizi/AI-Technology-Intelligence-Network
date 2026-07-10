import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="form-subtitle">Sign in to your ATIN account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading}>
          {isLoading ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />}
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>

      <style>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 4rem);
          padding: 2rem 1rem;
        }
        .form-subtitle {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          margin-top: -1rem;
        }
        .password-input-wrapper {
          position: relative;
        }
        .password-input-wrapper input {
          padding-right: 2.5rem;
        }
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          display: flex;
          padding: 0.25rem;
        }
        .password-toggle:hover {
          color: var(--text-secondary);
        }
        .btn-full {
          width: 100%;
          justify-content: center;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
