/**
 * Navbar – Sticky top navigation with WeatherNow brand.
 * Now includes GPS button and save location button integrated directly.
 */
export default function Navbar({ onGpsClick, isLocating, unit = 'C', onUnitChange }) {
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="6" fill="#38bdf8" />
              <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
                <line x1="14" y1="2" x2="14" y2="5" />
                <line x1="14" y1="23" x2="14" y2="26" />
                <line x1="2" y1="14" x2="5" y2="14" />
                <line x1="23" y1="14" x2="26" y2="14" />
                <line x1="5.5" y1="5.5" x2="7.6" y2="7.6" />
                <line x1="20.4" y1="20.4" x2="22.5" y2="22.5" />
                <line x1="5.5" y1="22.5" x2="7.6" y2="20.4" />
                <line x1="20.4" y1="7.6" x2="22.5" y2="5.5" />
              </g>
            </svg>
          </div>
          <h1 className="brand-name">WeatherNow</h1>
        </div>

        <div className="navbar-actions">
          {/* Temperature unit switch */}
          <div className="unit-toggle" role="group" aria-label="Temperature unit selector" id="unit-toggle">
            <button
              type="button"
              className={`unit-toggle-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => onUnitChange?.('C')}
              id="unit-c-btn"
              title="Show temperature in Celsius (°C)"
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-toggle-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => onUnitChange?.('F')}
              id="unit-f-btn"
              title="Show temperature in Fahrenheit (°F)"
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>

          <button
            className="nav-gps-btn"
            onClick={onGpsClick}
            disabled={isLocating}
            id="gps-btn"
            title="Use my current location"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
            <span>{isLocating ? 'Locating…' : 'My Location'}</span>
          </button>
          <div className="navbar-datetime">
            <span className="nav-time">{timeString}</span>
            <span className="nav-date">{dateString}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
