import { convertTemp } from '../services/weatherApi';

/**
 * CurrentWeather – Hero section with dynamic atmospheric background.
 * The background gradient changes based on weather conditions.
 */
export default function CurrentWeather({
  data,
  onSave,
  isSaved,
  onSetDefault,
  isDefault,
  unit = 'C',
  onToggleUnit,
}) {
  if (!data) return null;

  const {
    city,
    country,
    temp,
    feelsLike,
    tempMin,
    tempMax,
    description,
    icon,
    mood,
    sunrise,
    sunset,
    humidity,
    windSpeed,
  } = data;

  const displayTemp = convertTemp(temp, unit);
  const displayFeelsLike = convertTemp(feelsLike, unit);
  const displayTempMin = convertTemp(tempMin, unit);
  const displayTempMax = convertTemp(tempMax, unit);

  return (
    <section className={`current-weather mood-${mood}`} id="current-weather">
      {/* Atmospheric particles overlay */}
      <div className="weather-particles" aria-hidden="true">
        {(mood.includes('rain') || mood.includes('drizzle')) && (
          <div className="rain-effect">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }} />
            ))}
          </div>
        )}
        {mood.includes('snow') && (
          <div className="snow-effect">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${8 + Math.random() * 8}px`,
              }}>❄</div>
            ))}
          </div>
        )}
      </div>

      <div className="current-weather-inner">
        {/* Top row: location + actions */}
        <div className="current-header">
          <div className="current-location">
            <h2 className="current-city">{city}</h2>
            <span className="current-country">{country}</span>
          </div>
          <div className="current-actions">
            <button
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={onSave}
              title={isSaved ? 'Remove from saved' : 'Save this location'}
              id="save-location-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            {isSaved && (
              <button
                className={`default-btn ${isDefault ? 'is-default' : ''}`}
                onClick={onSetDefault}
                title={isDefault ? 'This is your default location' : 'Set as default'}
                id="set-default-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={isDefault ? 'currentColor' : 'none'} />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{isDefault ? 'Default' : 'Set Default'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main temperature display */}
        <div className="current-body">
          <div className="current-temp-block">
            <img src={icon} alt={description} className="current-icon" width="100" height="100" />
            <div className="current-temp-wrap">
              <div className="current-temp-row">
                <span className="current-temp">{displayTemp}°</span>
                <button
                  type="button"
                  className="current-unit-badge"
                  onClick={onToggleUnit}
                  title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
                  aria-label={`Temperature is in ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}. Click to toggle.`}
                  id="hero-unit-toggle"
                >
                  {unit}
                </button>
              </div>
              <span className="current-desc">{description}</span>
            </div>
          </div>

          <div className="current-stats">
            <div className="stat">
              <span className="stat-label">Feels Like</span>
              <span className="stat-value">{displayFeelsLike}°{unit}</span>
            </div>
            <div className="stat">
              <span className="stat-label">High / Low</span>
              <span className="stat-value">{displayTempMax}° / {displayTempMin}°</span>
            </div>
            <div className="stat">
              <span className="stat-label">Humidity</span>
              <span className="stat-value">{humidity}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Wind</span>
              <span className="stat-value">{windSpeed} m/s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Sunrise</span>
              <span className="stat-value">{sunrise}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Sunset</span>
              <span className="stat-value">{sunset}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
