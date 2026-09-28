/**
 * Loading – Polished loading state with animated weather icon.
 */
export default function Loading({ message = 'Fetching weather data…' }) {
  return (
    <div className="loading-container" id="loading-indicator">
      <div className="loading-icon-wrap">
        <svg className="loading-sun" width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="8" fill="#38bdf8" opacity="0.8" />
          <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
            <line x1="24" y1="4" x2="24" y2="10" />
            <line x1="24" y1="38" x2="24" y2="44" />
            <line x1="4" y1="24" x2="10" y2="24" />
            <line x1="38" y1="24" x2="44" y2="24" />
            <line x1="9.9" y1="9.9" x2="14.1" y2="14.1" />
            <line x1="33.9" y1="33.9" x2="38.1" y2="38.1" />
            <line x1="9.9" y1="38.1" x2="14.1" y2="33.9" />
            <line x1="33.9" y1="14.1" x2="38.1" y2="9.9" />
          </g>
        </svg>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
