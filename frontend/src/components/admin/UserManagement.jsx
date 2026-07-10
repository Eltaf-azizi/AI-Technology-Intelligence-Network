import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

const SAMPLE_USERS = Array.from({ length: 25 }, (_, i) => ({
  _id: `user_${i + 1}`,
  username: ['tech_user', 'data_scientist', 'ml_engineer', 'ai_researcher', 'analyst_pro'][i % 5] + (i + 1),
  email: `user${i + 1}@example.com`,
  role: i < 3 ? 'admin' : 'user',
  status: i % 7 === 0 ? 'inactive' : 'active',
  lastLogin: new Date(Date.now() - Math.random() * 30 * 86400000),
}));

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages] = useState(5);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUsers(SAMPLE_USERS);
      setLoading(false);
    }, 400);
  }, []);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
    setConfirmAction(null);
  };

  const handleDelete = (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    setConfirmAction(null);
  };

  return (
    <div className="user-management container">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-description">Manage registered users and permissions</p>
        </div>
        <div className="search-input">
          <Search size={16} />
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="table-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice((page - 1) * 10, page * 10).map((user) => (
                  <tr key={user._id}>
                    <td className="td-name">{user.username}</td>
                    <td className="td-email">{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-emerging' : ''}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot ${user.status}`} />
                      {user.status}
                    </td>
                    <td className="td-date">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn btn-sm btn-ghost"
                          title="Toggle admin role"
                          onClick={() => handleRoleChange(user._id)}
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          title="Toggle status"
                          onClick={() => setConfirmAction({ type: 'status', userId: user._id, username: user.username })}
                        >
                          <Ban size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--error)' }}
                          title="Delete user"
                          onClick={() => setConfirmAction({ type: 'delete', userId: user._id, username: user.username })}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-cell">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn btn-sm btn-ghost"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-info">{page} / {totalPages}</span>
            <button
              className="btn btn-sm btn-ghost"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={32} className="modal-icon" />
            <h3>Confirm Action</h3>
            <p>
              {confirmAction.type === 'status'
                ? `Are you sure you want to change the status of "${confirmAction.username}"?`
                : `Are you sure you want to delete "${confirmAction.username}"? This action cannot be undone.`}
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button
                className={`btn ${confirmAction.type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() =>
                  confirmAction.type === 'status'
                    ? handleToggleStatus(confirmAction.userId)
                    : handleDelete(confirmAction.userId)
                }
              >
                {confirmAction.type === 'delete' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .user-management {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .page-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .table-loading {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border-primary);
        }
        .user-table td {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-primary);
          vertical-align: middle;
        }
        .user-table tr:hover td {
          background: var(--bg-tertiary);
        }
        .td-name { font-weight: 500; }
        .td-email { color: var(--text-secondary); }
        .td-date { color: var(--text-tertiary); font-size: 0.8125rem; }
        .empty-cell {
          text-align: center;
          padding: 2rem !important;
          color: var(--text-tertiary);
        }
        .status-dot {
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-right: 0.375rem;
        }
        .status-dot.active { background: var(--success); }
        .status-dot.inactive { background: var(--text-tertiary); }
        .action-btns {
          display: flex;
          gap: 0.25rem;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
        }
        .page-info {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          padding: 2rem;
          max-width: 420px;
          width: 90%;
          text-align: center;
        }
        .modal-icon {
          color: var(--warning);
          margin-bottom: 1rem;
        }
        .modal h3 {
          margin-bottom: 0.5rem;
        }
        .modal p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
