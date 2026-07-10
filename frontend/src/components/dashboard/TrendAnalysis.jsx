import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpDown, Filter, Loader2 } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';
import { CATEGORIES, STAGES } from '../../utils/constants';

function generateSampleTrends() {
  const techNames = [
    'Large Language Models', 'Vector Databases', 'AI Agents',
    'Edge AI', 'Multimodal AI', 'RAG Systems',
    'Computer Vision', 'Autonomous Vehicles', 'AI Governance',
    'Federated Learning', 'Synthetic Data', 'Neural Interfaces',
  ];
  return techNames.map((name, i) => ({
    id: i + 1,
    name,
    growthRate: (Math.random() - 0.3) * 60,
    momentum: Math.random() * 100,
    stage: STAGES[Math.floor(Math.random() * STAGES.length)].value,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    insight: `${name} shows ${Math.random() > 0.5 ? 'strong' : 'moderate'} momentum in recent quarters driven by enterprise adoption.`,
  }));
}

export default function TrendAnalysis() {
  const [trends, setTrends] = useState([]);
  const [sortBy, setSortBy] = useState('growthRate');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTrends(generateSampleTrends());
      setLoading(false);
    }, 500);
  }, []);

  const stageConfig = {
    emerging: { label: 'Emerging', className: 'badge-emerging' },
    growth: { label: 'Growth', className: 'badge-growth' },
    maturity: { label: 'Maturity', className: 'badge-maturity' },
    decline: { label: 'Decline', className: 'badge-decline' },
  };

  const sorted = [...trends]
    .filter((t) => {
      if (filterCategory && t.category !== filterCategory) return false;
      if (filterStage && t.stage !== filterStage) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'growthRate') return b.growthRate - a.growthRate;
      if (sortBy === 'momentum') return b.momentum - a.momentum;
      return 0;
    });

  return (
    <div className="trend-analysis card">
      <div className="trend-header">
        <div className="trend-title-row">
          <TrendingUp size={18} />
          <h3>Trend Analysis</h3>
        </div>
        <div className="trend-controls">
          <select
            className="trend-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="growthRate">Sort by Growth</option>
            <option value="momentum">Sort by Momentum</option>
          </select>
          <div className="trend-filters">
            <select
              className="trend-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="trend-select"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="">All Stages</option>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="trend-loading">
          <Loader2 size={24} className="spin" />
        </div>
      ) : (
        <div className="trend-grid">
          {sorted.map((trend) => {
            const stage = stageConfig[trend.stage] || stageConfig.emerging;
            const barWidth = Math.min(Math.abs(trend.growthRate) * 1.5, 100);
            const isPositive = trend.growthRate >= 0;
            return (
              <div key={trend.id} className="trend-card">
                <div className="trend-card-top">
                  <h4 className="trend-name">{trend.name}</h4>
                  <span className={`badge ${stage.className}`}>{stage.label}</span>
                </div>
                <div className="trend-stats">
                  <div className="trend-stat">
                    <span className="trend-stat-label">Growth</span>
                    <span className={`trend-stat-value ${isPositive ? 'positive' : 'negative'}`}>
                      {formatPercentage(trend.growthRate)}
                    </span>
                  </div>
                  <div className="trend-stat">
                    <span className="trend-stat-label">Momentum</span>
                    <span className="trend-stat-value">
                      {trend.momentum.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="trend-bar-wrapper">
                  <div
                    className={`trend-bar ${isPositive ? 'positive' : 'negative'}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <div className="trend-category">{trend.category}</div>
                <p className="trend-insight">{trend.insight}</p>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .trend-analysis {
          padding: 0;
          overflow: hidden;
        }
        .trend-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
        }
        .trend-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-primary);
          margin-bottom: 0.75rem;
        }
        .trend-title-row h3 {
          margin: 0;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .trend-controls {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .trend-select {
          padding: 0.375rem 0.625rem;
          font-size: 0.8125rem;
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          color: var(--text-secondary);
          cursor: pointer;
        }
        .trend-select:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .trend-filters {
          display: flex;
          gap: 0.5rem;
        }
        .trend-loading {
          padding: 3rem;
          display: flex;
          justify-content: center;
        }
        .trend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          padding: 1rem 1.25rem;
        }
        .trend-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: 1rem;
          transition: all var(--transition-fast);
        }
        .trend-card:hover {
          border-color: var(--border-secondary);
          background: var(--bg-elevated);
        }
        .trend-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .trend-name {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
        }
        .trend-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .trend-stat {
          display: flex;
          flex-direction: column;
        }
        .trend-stat-label {
          font-size: 0.6875rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .trend-stat-value {
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-mono);
        }
        .trend-stat-value.positive { color: var(--success); }
        .trend-stat-value.negative { color: var(--error); }
        .trend-bar-wrapper {
          height: 4px;
          background: var(--bg-primary);
          border-radius: 2px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }
        .trend-bar {
          height: 100%;
          border-radius: 2px;
          transition: width var(--transition-slow);
        }
        .trend-bar.positive { background: var(--success); }
        .trend-bar.negative { background: var(--error); }
        .trend-category {
          font-size: 0.6875rem;
          color: var(--text-tertiary);
          margin-bottom: 0.375rem;
        }
        .trend-insight {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .trend-filters {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
