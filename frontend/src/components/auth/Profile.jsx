import { useState, useEffect } from 'react';
import { Save, Loader2, User, Bell, Palette } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { isValidUsername } from '../../utils/validators';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    categories: [],
    emailNotifications: true,
    pushNotifications: true,
    theme: 'dark',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        categories: user.preferences?.categories || [],
        emailNotifications: user.preferences?.emailNotifications ?? true,
        pushNotifications: user.preferences?.pushNotifications ?? true,
        theme: user.preferences?.theme || 'dark',
      });
    }
  }, [user]);

  const handleSave = async () => {
    const usernameError = !isValidUsername(form.username);
    if (usernameError) {
      setMessage({ type: 'error', text: 'Username must be 3-30 alphanumeric characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({
        username: form.username,
        preferences: {
          categories: form.categories,
          emailNotifications: form.emailNotifications,
          pushNotifications: form.pushNotifications,
          theme: form.theme,
        },
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
    'Natural Language Processing', 'Computer Vision', 'Robotics',
    'Edge Computing', 'Quantum Computing', 'Cybersecurity',
  ];

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  if (!user) return null;

  return (
    <div className="profile-page container">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="profile-grid">
        <div className="card">
          <div className="card-header">
            <User size={18} />
            <h3>Account Info</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input value={form.email} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Member Since</label>
              <input
                value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <Bell size={18} />
            <h3>Notification Preferences</h3>
          </div>
          <div className="card-body">
            <label className="toggle-row">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm((p) => ({ ...p, emailNotifications: e.target.checked }))}
                className="toggle-input"
              />
              <span className="toggle-track" />
            </label>
            <label className="toggle-row">
              <span>Push Notifications</span>
              <input
                type="checkbox"
                checked={form.pushNotifications}
                onChange={(e) => setForm((p) => ({ ...p, pushNotifications: e.target.checked }))}
                className="toggle-input"
              />
              <span className="toggle-track" />
            </label>
            <div className="form-group">
              <label className="form-label">Categories of Interest</label>
              <div className="chip-group">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`chip ${form.categories.includes(cat) ? 'active' : ''}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <Palette size={18} />
            <h3>Appearance</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Theme</label>
              <select
                value={form.theme}
                onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
          color: var(--accent-primary);
        }
        .card-header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-primary);
        }
        .card-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          cursor: pointer;
          gap: 1rem;
        }
        .toggle-row span:first-child {
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .toggle-input {
          display: none;
        }
        .toggle-track {
          width: 2.5rem;
          height: 1.375rem;
          background: var(--border-secondary);
          border-radius: 9999px;
          position: relative;
          transition: background var(--transition-fast);
          flex-shrink: 0;
        }
        .toggle-track::after {
          content: '';
          position: absolute;
          top: 0.1875rem;
          left: 0.1875rem;
          width: 1rem;
          height: 1rem;
          background: var(--text-primary);
          border-radius: 50%;
          transition: transform var(--transition-fast);
        }
        .toggle-input:checked + .toggle-track {
          background: var(--accent-primary);
        }
        .toggle-input:checked + .toggle-track::after {
          transform: translateX(1.125rem);
        }
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .chip {
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .chip:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .chip.active {
          background: var(--accent-glow);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
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
