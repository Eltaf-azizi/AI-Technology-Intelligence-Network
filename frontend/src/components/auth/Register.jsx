import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, isValidUsername } from '../../utils/validators';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    else if (!isValidUsername(form.username)) newErrors.username = 'Username must be 3-30 alphanumeric characters';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (!isValidPassword(form.password)) newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, and number';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="form-subtitle">Join ATIN and start monitoring AI trends</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={handleChange('username')}
            placeholder="your_username"
            autoComplete="username"
          />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Create a strong password"
              autoComplete="new-password"
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
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading}>
          {isLoading ? <Loader2 size={18} className="spin" /> : <UserPlus size={18} />}
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>

        <div className="form-footer">
          Already have an account? <Link to="/login">Sign in</Link>
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
