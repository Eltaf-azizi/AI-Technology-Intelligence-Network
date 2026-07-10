import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  FileText,
  Cpu,
  Download,
  Loader2,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const generateTimeSeries = (days, base = 50, variance = 20) => {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    data.push({
      date: date.toISOString().slice(0, 10),
      value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance),
    });
  }
  return data;
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const userGrowth = generateTimeSeries(30, 50, 15);
  const contentProduction = generateTimeSeries(30, 120, 30);
  const apiUsage = generateTimeSeries(30, 5000, 1000);
  const performance = generateTimeSeries(30, 98, 2);

  const summaryStats = [
    { label: 'Total API Calls', value: '152.4K', change: '+12%', icon: Cpu, color: '#00d4ff' },
    { label: 'Avg Response Time', value: '234ms', change: '-8%', icon: BarChart3, color: '#00e676' },
    { label: 'Active Users', value: '1,247', change: '+5%', icon: Users, color: '#448aff' },
    { label: 'Content Processed', value: '4,523', change: '+18%', icon: FileText, color: '#ffab00' },
  ];

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-row" style={{ color: p.color }}>
            <span>{p.name}</span>
            <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const RANGE_OPTIONS = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ];

  return (
    <div className="admin-analytics container">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-description">System-wide metrics and performance data</p>
        </div>
        <div className="analytics-actions">
          <div className="range-selector">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.value}
                className={`btn btn-sm ${dateRange === r.value ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDateRange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="analytics-stats">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-change ${stat.change.startsWith('+') ? 'up' : 'down'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="analytics-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="analytics-charts">
          <div className="card">
            <div className="chart-card-header">
              <Users size={16} />
              <h3>User Growth</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#448aff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#448aff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#8892b0', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8892b0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#448aff" strokeWidth={2} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="chart-card-header">
              <FileText size={16} />
              <h3>Content Production</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={contentProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#8892b0', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8892b0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" fill="#ffab00" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="chart-card-header">
              <Cpu size={16} />
              <h3>API Usage</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={apiUsage}>
                  <defs>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#8892b0', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8892b0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fill="url(#apiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="chart-card-header">
              <BarChart3 size={16} />
              <h3>System Performance (uptime %)</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#8892b0', fontSize: 10 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis domain={[95, 100]} tick={{ fill: '#8892b0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="value" stroke="#00e676" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-analytics {
          padding-top: 1.5rem;
          padding-bottom: 2rem;
        }
        .page-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .analytics-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .range-selector {
          display: flex;
          gap: 0.25rem;
        }
        .analytics-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 1024px) {
          .analytics-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .analytics-stats { grid-template-columns: 1fr; }
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
        }
        .stat-icon {
          width: 2.75rem;
          height: 2.75rem;
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
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .stat-change.up { color: var(--success); }
        .stat-change.down { color: var(--error); }
        .analytics-loading {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .analytics-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .analytics-charts { grid-template-columns: 1fr; }
        }
        .chart-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          color: var(--accent-primary);
        }
        .chart-card-header h3 {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .chart-body {
          padding: 0.75rem 0.5rem 0.5rem;
        }
        .chart-tooltip {
          background: var(--bg-elevated);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: 0.625rem 0.875rem;
          box-shadow: var(--shadow-lg);
        }
        .tooltip-label {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }
        .tooltip-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.75rem;
          padding: 0.125rem 0;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
