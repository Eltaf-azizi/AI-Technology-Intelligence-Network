import { useState, useEffect } from 'react';
import {
  Newspaper,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { formatRelativeDate, truncateText } from '../../utils/formatters';

const SAMPLE_CONTENT = Array.from({ length: 12 }, (_, i) => ({
  _id: `news_${i + 1}`,
  title: `AI Research Paper ${i + 1}: New Breakthrough in ${['Transformers', 'Diffusion Models', 'RLHF', 'Quantization', 'RAG'][i % 5]}`,
  source: ['TechCrunch', 'arXiv', 'MIT News', 'OpenAI Blog', 'Google AI'][i % 5],
  status: i < 5 ? 'pending' : i < 9 ? 'approved' : 'flagged',
  sentiment: i % 2 === 0 ? 'positive' : 'neutral',
  submittedAt: new Date(Date.now() - i * 3600000),
  submittedBy: `user_${(i % 5) + 1}`,
}));

export default function ContentModeration() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setItems(SAMPLE_CONTENT);
      setLoading(false);
    }, 300);
  }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);

  const handleApprove = (id) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'approved' } : i)));
  };

  const handleReject = (id) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'rejected' } : i)));
  };

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const flaggedCount = items.filter((i) => i.status === 'flagged').length;

  return (
    <div className="content-mod container">
      <div className="page-header">
        <div>
          <h1>Content Moderation</h1>
          <p className="page-description">
            {pendingCount} pending · {flaggedCount} flagged
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => window.location.reload()}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="mod-filters">
        {['all', 'pending', 'approved', 'flagged', 'rejected'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span className="filter-count">{pendingCount}</span>
            )}
            {f === 'flagged' && flaggedCount > 0 && (
              <span className="filter-count">{flaggedCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mod-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="mod-grid">
          {filtered.map((item) => (
            <div key={item._id} className={`mod-card card ${item.status}`}>
              <div className="mod-card-top">
                <span className={`mod-status ${item.status}`}>
                  {item.status}
                </span>
                <span className="mod-date">{formatRelativeDate(item.submittedAt)}</span>
              </div>
              <h4 className="mod-title">{truncateText(item.title, 80)}</h4>
              <div className="mod-meta">
                <span className="mod-source">{item.source}</span>
                <span className="mod-author">by {item.submittedBy}</span>
              </div>
              {item.status === 'flagged' && (
                <div className="mod-flag-reason">
                  <AlertTriangle size={12} />
                  Flagged for review
                </div>
              )}
              {item.status === 'pending' || item.status === 'flagged' ? (
                <div className="mod-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => handleApprove(item._id)}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleReject(item._id)}>
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              ) : item.status === 'approved' ? (
                <div className="mod-approved-badge">
                  <CheckCircle size={14} /> Approved
                </div>
              ) : (
                <div className="mod-rejected-badge">
                  <XCircle size={14} /> Rejected
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <Newspaper size={32} />
              <p>No {filter} content</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .content-mod {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .page-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .mod-filters {
          display: flex;
          gap: 0.375rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .filter-count {
          margin-left: 0.25rem;
          padding: 0.0625rem 0.375rem;
          background: rgba(255,255,255,0.1);
          border-radius: 9999px;
          font-size: 0.6875rem;
        }
        .mod-loading {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .mod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .mod-card {
          padding: 1.25rem;
        }
        .mod-card.flagged {
          border-color: rgba(255, 82, 82, 0.2);
        }
        .mod-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .mod-status {
          font-size: 0.6875rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .mod-status.pending { background: rgba(255,171,0,0.15); color: var(--warning); }
        .mod-status.approved { background: rgba(0,230,118,0.15); color: var(--success); }
        .mod-status.flagged { background: rgba(255,82,82,0.15); color: var(--error); }
        .mod-status.rejected { background: rgba(136,146,176,0.15); color: var(--text-tertiary); }
        .mod-date {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .mod-title {
          font-size: 0.9375rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .mod-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-bottom: 0.75rem;
        }
        .mod-flag-reason {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--warning);
          margin-bottom: 0.75rem;
        }
        .mod-actions {
          display: flex;
          gap: 0.5rem;
        }
        .mod-approved-badge, .mod-rejected-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
        }
        .mod-approved-badge { color: var(--success); }
        .mod-rejected-badge { color: var(--text-tertiary); }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
