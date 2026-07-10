import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">ATIN</span>
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} AI Technology Intelligence Network
          </span>
        </div>
        <div className="footer-right">
          <span className="footer-version">v1.0.0</span>
          <Link to="/docs" className="footer-link">Docs</Link>
          <a href="https://github.com/anomalyco/opencode" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        </div>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--border-primary);
          background: var(--bg-secondary);
          padding: 1rem 0;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .footer-logo {
          font-size: 0.875rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-primary), #7c4dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-copyright {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
        }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .footer-version {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
        }
        .footer-link {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--accent-primary);
        }
        @media (max-width: 480px) {
          .footer-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
