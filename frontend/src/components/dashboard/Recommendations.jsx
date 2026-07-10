import { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Loader2, BookOpen, Target, Eye } from 'lucide-react';

const TYPE_CONFIG = {
  learn: { icon: BookOpen, label: 'Learn', color: '#448aff', bg: 'rgba(68,138,255,0.1)' },
  adopt: { icon: Target, label: 'Adopt', color: '#00e676', bg: 'rgba(0,230,118,0.1)' },
  monitor: { icon: Eye, label: 'Monitor', color: '#ffab00', bg: 'rgba(255,171,0,0.1)' },
};

function generateSampleRecommendations() {
  return [
    {
      id: 1,
      title: 'Explore Vector Database Integration',
      description: 'Vector databases are showing 340% growth. Consider integrating Pinecone or Weaviate for your AI stack.',
      type: 'adopt',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Learn RAG Architecture Patterns',
      description: 'Retrieval-Augmented Generation is becoming the standard for production LLM applications.',
      type: 'learn',
      priority: 'high',
    },
    {
      id: 3,
      title: 'Monitor AI Governance Regulations',
      description: 'New AI regulations are emerging globally. Stay informed about compliance requirements.',
      type: 'monitor',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Evaluate Edge AI Solutions',
      description: 'Edge AI adoption is accelerating with new hardware optimized for local inference.',
      type: 'adopt',
      priority: 'medium',
    },
    {
      id: 5,
      title: 'Deep Dive into Multimodal Models',
      description: 'GPT-4V and Gemini are pushing multimodal capabilities. Assess use cases for your domain.',
      type: 'learn',
      priority: 'low',
    },
  ];
}

export default function Recommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setItems(generateSampleRecommendations());
      setLoading(false);
    }, 600);
  }, []);

  const priorityColors = {
    high: { dot: '#ff5252', bg: 'rgba(255,82,82,0.1)' },
    medium: { dot: '#ffab00', bg: 'rgba(255,171,0,0.1)' },
    low: { dot: '#8892b0', bg: 'rgba(136,146,176,0.1)' },
  };

  return (
    <div className="recommendations card">
      <div className="rec-header">
        <Lightbulb size={18} />
        <h3>AI Recommendations</h3>
      </div>

      {loading ? (
        <div className="rec-loading">
          <Loader2 size={24} className="spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <Lightbulb size={32} />
          <p>No recommendations yet</p>
        </div>
      ) : (
        <div className="rec-list">
          {items.map((item) => {
            const typeCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.monitor;
            const priority = priorityColors[item.priority] || priorityColors.low;
            const Icon = typeCfg.icon;
            return (
              <div key={item.id} className="rec-item">
                <div className="rec-item-left">
                  <div className="rec-type-icon" style={{ background: typeCfg.bg, color: typeCfg.color }}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="rec-item-content">
                  <div className="rec-item-top">
                    <h4 className="rec-item-title">{item.title}</h4>
                    <span className="rec-priority-dot" style={{ background: priority.dot }} />
                  </div>
                  <p className="rec-item-desc">{item.description}</p>
                  <div className="rec-item-footer">
                    <span className="rec-type-badge" style={{ background: typeCfg.bg, color: typeCfg.color }}>
                      {typeCfg.label}
                    </span>
                    <button className="rec-action-btn">
                      View <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .recommendations {
          padding: 0;
          overflow: hidden;
        }
        .rec-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          color: var(--accent-primary);
        }
        .rec-header h3 {
          margin: 0;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .rec-loading {
          padding: 3rem;
          display: flex;
          justify-content: center;
        }
        .rec-list {
          max-height: 480px;
          overflow-y: auto;
        }
        .rec-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          transition: background var(--transition-fast);
        }
        .rec-item:hover {
          background: var(--bg-tertiary);
        }
        .rec-item:last-child {
          border-bottom: none;
        }
        .rec-item-left {
          flex-shrink: 0;
        }
        .rec-type-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rec-item-content {
          flex: 1;
          min-width: 0;
        }
        .rec-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .rec-item-title {
          font-size: 0.8125rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
        }
        .rec-priority-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .rec-item-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }
        .rec-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rec-type-badge {
          font-size: 0.6875rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 500;
        }
        .rec-action-btn {
          font-size: 0.75rem;
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }
        .rec-action-btn:hover {
          background: var(--accent-glow);
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
