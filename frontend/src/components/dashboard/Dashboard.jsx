import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Newspaper,
  BarChart3,
  Cpu,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { getDashboard } from '../../services/analyticsService';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import SentimentChart from './SentimentChart';
import TrendAnalysis from './TrendAnalysis';
import Recommendations from './Recommendations';
import NewsFeed from './NewsFeed';
import LoadingSpinner from '../common/LoadingSpinner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner overlay />;

  if (error) {
    return (
      <div className="dashboard-error container">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={fetchDashboard}>
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Trends',
      value: formatNumber(data?.stats?.totalTrends ?? 0),
      icon: TrendingUp,
      color: '#00d4ff',
    },
    {
      label: 'News Analyzed',
      value: formatNumber(data?.stats?.totalNews ?? 0),
      icon: Newspaper,
      color: '#7c4dff',
    },
    {
      label: 'Avg Sentiment',
      value: data?.stats?.avgSentiment != null ? (data.stats.avgSentiment * 100).toFixed(0) + '%' : 'N/A',
      icon: Activity,
      color: '#00e676',
    },
    {
      label: 'Active Technologies',
      value: formatNumber(data?.stats?.activeTechnologies ?? 0),
      icon: Cpu,
      color: '#ffab00',
    },
  ];

  return (
    <div className="dashboard container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-description">
            Real-time AI technology intelligence overview
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchDashboard}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <SentimentChart />
          <TrendAnalysis />
        </div>
        <div className="dashboard-sidebar">
          <Recommendations />
          <NewsFeed />
        </div>
      </div>

      <style>{`
        .dashboard {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .page-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .dashboard-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding-top: 3rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
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
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
        }
        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .dashboard-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .dashboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
}
