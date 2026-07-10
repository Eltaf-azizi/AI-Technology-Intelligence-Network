import { useState, useEffect, useCallback } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { getNews } from '../../services/newsService';
import { formatRelativeDate, truncateText, formatSentiment } from '../../utils/formatters';
import useWebSocket from '../../hooks/useWebSocket';

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { subscribe } = useWebSocket();

  const fetchNews = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const { data, totalPages } = await getNews({ page: pageNum, limit: 10 });
      if (append) {
        setNews((prev) => [...prev, ...(data || [])]);
      } else {
        setNews(data || []);
      }
      setHasMore(pageNum < (totalPages || 1));
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  useEffect(() => {
    subscribe('news');
  }, [subscribe]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchNews(next, true);
  };

  if (loading) {
    return (
      <div className="news-feed card">
        <div className="card-header-row">
          <Newspaper size={18} />
          <h3>Latest News</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Loader2 size={24} className="spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="news-feed card">
      <div className="card-header-row">
        <Newspaper size={18} />
        <h3>Latest News</h3>
        <button className="btn btn-sm btn-ghost" onClick={() => { setPage(1); fetchNews(1); }}>
          <RefreshCw size={14} />
        </button>
      </div>

      {news.length === 0 ? (
        <div className="empty-state">
          <Newspaper size={32} />
          <p>No news articles yet</p>
        </div>
      ) : (
        <div className="news-list">
          {news.map((item) => {
            const sentiment = formatSentiment(item.sentiment?.score);
            return (
              <div key={item._id} className="news-item">
                <div className="news-item-top">
                  <span className={`badge ${sentiment.className}`}>
                    {sentiment.label}
                  </span>
                  <span className="news-date">
                    {formatRelativeDate(item.publishedAt || item.createdAt)}
                  </span>
                </div>
                <h4 className="news-title">{truncateText(item.title, 100)}</h4>
                {item.summary && (
                  <p className="news-summary">{truncateText(item.summary, 150)}</p>
                )}
                <div className="news-meta">
                  {item.source && (
                    <span className="news-source">{item.source}</span>
                  )}
                  {item.category && (
                    <span className="news-category">{item.category}</span>
                  )}
                </div>
                {item.technologies?.length > 0 && (
                  <div className="news-techs">
                    {item.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    <ExternalLink size={12} /> Read more
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <button
          className="btn btn-ghost btn-full load-more"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? <Loader2 size={14} className="spin" /> : 'Load more'}
        </button>
      )}

      <style>{`
        .news-feed {
          padding: 0;
          overflow: hidden;
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
          flex: 1;
          margin: 0;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .news-list {
          max-height: 600px;
          overflow-y: auto;
        }
        .news-item {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-primary);
          transition: background var(--transition-fast);
        }
        .news-item:hover {
          background: var(--bg-tertiary);
        }
        .news-item:last-child {
          border-bottom: none;
        }
        .news-item-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .news-date {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-left: auto;
        }
        .news-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.375rem;
          line-height: 1.4;
        }
        .news-summary {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        .news-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }
        .news-source {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .news-category {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }
        .news-techs {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }
        .tech-tag {
          font-size: 0.6875rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          background: rgba(0, 212, 255, 0.1);
          color: var(--accent-primary);
        }
        .news-link {
          font-size: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--accent-primary);
        }
        .load-more {
          width: 100%;
          justify-content: center;
          border-top: 1px solid var(--border-primary);
          padding: 0.75rem;
        }
        .spin {
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .btn-full {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
