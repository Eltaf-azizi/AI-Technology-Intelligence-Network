import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, Loader2 } from 'lucide-react';
import { getSentimentTrends } from '../../services/analyticsService';

const DATE_RANGES = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

const COLORS = ['#00d4ff', '#7c4dff', '#00e676', '#ffab00', '#ff5252', '#448aff'];

export default function SentimentChart() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getSentimentTrends({ range });
        setData(result?.data || []);
        setTechnologies(result?.technologies || []);
      } catch {
        // fallback sample data
        const sample = [];
        const now = Date.now();
        for (let i = 29; i >= 0; i--) {
          const entry = { date: new Date(now - i * 86400000).toISOString().slice(0, 10) };
          ['AI', 'ML', 'Blockchain', 'Quantum', 'Cybersecurity'].forEach((tech, idx) => {
            entry[tech] = Math.sin(i / 5 + idx) * 0.3 + 0.5 + Math.random() * 0.1;
          });
          sample.push(entry);
        }
        setData(sample);
        setTechnologies(['AI', 'ML', 'Blockchain', 'Quantum', 'Cybersecurity']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((entry, i) => (
          <div key={i} className="tooltip-row" style={{ color: entry.color }}>
            <span>{entry.name}</span>
            <span>{(entry.value * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="sentiment-chart card">
      <div className="chart-header">
        <div className="chart-title-row">
          <BarChart3 size={18} />
          <h3>Sentiment Trends</h3>
        </div>
        <div className="chart-filters">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              className={`btn btn-sm ${range === r.value ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-body">
        {loading ? (
          <div className="chart-loading">
            <Loader2 size={24} className="spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#8892b0', fontSize: 11 }}
                tickFormatter={(val) => val?.slice(5) || ''}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fill: '#8892b0', fontSize: 11 }}
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#8892b0' }}
              />
              {technologies.map((tech, i) => (
                <Line
                  key={tech}
                  type="monotone"
                  dataKey={tech}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <style>{`
        .sentiment-chart {
          padding: 0;
          overflow: hidden;
        }
        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .chart-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-primary);
        }
        .chart-title-row h3 {
          margin: 0;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .chart-filters {
          display: flex;
          gap: 0.25rem;
        }
        .chart-body {
          padding: 1rem 0.5rem 0.5rem;
        }
        .chart-loading {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chart-tooltip {
          background: var(--bg-elevated);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          box-shadow: var(--shadow-lg);
        }
        .tooltip-label {
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 0.375rem;
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
