import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Activity,
  FileText,
  RefreshCw,
  UserPlus,
  Clock,
  Loader2,
} from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeSessions: 89,
        contentCount: 4523,
        systemHealth: 98.7,
        recentRegistrations: [
          { id: 1, username: 'tech_analyst', email: 'alice@example.com', createdAt: new Date(Date.now() - 300000) },
          { id: 2, username: 'data_driven', email: 'bob@example.com', createdAt: new Date(Date.now() - 1800000) },
          { id: 3, username: 'ai_watcher', email: 'carol@example.com', createdAt: new Date(Date.now() - 3600000) },
          { id: 4, username: 'ml_pioneer', email: 'dave@example.com', createdAt: new Date(Date.now() - 7200000) },
          { id: 5, username: 'neural_fan', email: 'eve@example.com', createdAt: new Date(Date.now() - 14400000) },
        ],
        systemLogs: [
          'Sentiment analysis pipeline completed',
          'News aggregation cycle finished (245 articles)',
          'Trend calculation updated for Q3',
          'Database backup completed successfully',
          'API rate limit increased for premium tier',
        ],
      });
      setLoading(false);
    }, 400);
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: '#448aff' },
    { label: 'Active Sessions', value: stats?.activeSessions ?? 0, icon: Activity, color: '#00e676' },
    { label: 'Content Items', value: stats?.contentCount ?? 0, icon: FileText, color: '#ffab00' },
    { label: 'System Health', value: stats?.systemHealth != null ? `${stats.systemHealth}%` : 'N/A', icon: Shield, color: '#00d4ff' },
  ];

  if (loading) return <div className="admin-loading"><Loader2 size={32} className="spin" /></div>;

  return (
    <div className="admin-dashboard container">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-description">System overview and management</p>
        </div>
        <button className="btn btn-ghost" onClick={() => window.location.reload()}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              <card.icon size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="card">
          <div className="card-header-row">
            <UserPlus size={18} />
            <h3>Recent Registrations</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentRegistrations?.map((u) => (
                  <tr key={u.id}>
                    <td className="td-username">{u.username}</td>
                    <td className="td-email">{u.email}</td>
                    <td className="td-date">{formatRelativeDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header-row">
            <Clock size={18} />
            <h3>System Logs</h3>
          </div>
          <div className="logs-list">
            {stats?.systemLogs?.map((log, i) => (
              <div key={i} className="log-item">
                <span className="log-dot" />
                <span className="log-text">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .admin-loading {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .page-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
        }
        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr; }
        }
        .card-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          color: var(--accent-primary);
        }
        .card-header-row h3 {
          margin: 0;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .admin-table-wrapper {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border-primary);
        }
        .admin-table td {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .td-username { font-weight: 500; }
        .td-email { color: var(--text-secondary); }
        .td-date { color: var(--text-tertiary); font-size: 0.8125rem; }
        .logs-list {
          padding: 0.5rem 1rem;
        }
        .log-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .log-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: var(--success);
          flex-shrink: 0;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
