import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <AlertTriangle size={48} />
          <h2>Something went wrong</h2>
          <p className="error-message">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button className="btn btn-primary" onClick={this.handleRetry}>
            <RefreshCw size={16} />
            Try again
          </button>
          <style>{`
            .error-boundary-fallback {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 4rem 2rem;
              text-align: center;
              gap: 1rem;
              color: var(--error);
            }
            .error-boundary-fallback h2 {
              color: var(--text-primary);
            }
            .error-message {
              color: var(--text-secondary);
              max-width: 400px;
              font-size: 0.875rem;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
