/**
 * ErrorMessage – Friendly error display with optional retry.
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" id="error-message">
      <div className="error-visual">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry} id="error-retry-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
