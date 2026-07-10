export default function LoadingSpinner({ size = 32, overlay = false }) {
  const content = (
    <div className="spinner-wrapper" style={{ width: size, height: size }}>
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );

  if (overlay) {
    return (
      <div className="spinner-overlay">
        {content}
        <style>{`
          .spinner-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10, 14, 26, 0.7);
            backdrop-filter: blur(4px);
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {content}
      <style>{`
        .spinner-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinner {
          border: 3px solid var(--border-secondary);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
