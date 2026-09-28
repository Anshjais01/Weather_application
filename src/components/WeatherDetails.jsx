import { convertTemp } from '../services/weatherApi';

/**
 * WeatherDetails – Metrics grid + horizontally scrolling hourly forecast.
 */
export default function WeatherDetails({ data, hourly, unit = 'C' }) {
  if (!data) return null;

  const details = [
    { label: 'Humidity',       value: `${data.humidity}%`,                          icon: 'humidity',    id: 'detail-humidity' },
    { label: 'Wind Speed',     value: `${data.windSpeed} m/s`,                      icon: 'wind',        id: 'detail-wind' },
    { label: 'Pressure',       value: `${data.pressure} hPa`,                       icon: 'pressure',    id: 'detail-pressure' },
    { label: 'Visibility',     value: data.visibility ? `${data.visibility} km` : 'N/A', icon: 'eye',    id: 'detail-visibility' },
    { label: 'Cloudiness',     value: `${data.clouds}%`,                            icon: 'cloud',       id: 'detail-clouds' },
    { label: 'Wind Direction', value: `${getWindDirection(data.windDeg)}`,           icon: 'compass',     id: 'detail-wind-dir' },
  ];

  return (
    <section className="weather-details" id="weather-details">
      <h3 className="section-title">Today's Details</h3>
      <div className="details-grid">
        {details.map((item) => (
          <div className="detail-card" key={item.id} id={item.id}>
            <div className={`detail-icon-wrap icon-${item.icon}`}>
              <DetailIcon type={item.icon} />
            </div>
            <div className="detail-info">
              <span className="detail-label">{item.label}</span>
              <span className="detail-value">{item.value}</span>
            </div>
            {item.icon === 'humidity' && (
              <div className="detail-bar">
                <div className="detail-bar-fill" style={{ width: `${data.humidity}%` }} />
              </div>
            )}
            {item.icon === 'cloud' && (
              <div className="detail-bar">
                <div className="detail-bar-fill cloud-bar" style={{ width: `${data.clouds}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {hourly && hourly.length > 0 && (
        <div className="hourly-section">
          <h3 className="section-title">Next 24 Hours</h3>
          <div className="hourly-strip" id="hourly-forecast">
            {hourly.map((hour, i) => (
              <div className="hourly-item" key={i}>
                <span className="hourly-time">{hour.time}</span>
                <img src={hour.icon} alt={hour.description} width="44" height="44" loading="lazy" />
                <span className="hourly-temp">{convertTemp(hour.temp, unit)}°</span>
                <span className="hourly-wind">{hour.windSpeed.toFixed(1)} m/s</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** Convert wind degrees to compass direction */
function getWindDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return `${dirs[Math.round(deg / 22.5) % 16]} (${deg}°)`;
}

/** SVG icons for detail cards */
function DetailIcon({ type }) {
  const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (type) {
    case 'humidity':
      return <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
    case 'wind':
      return <svg {...props}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>;
    case 'pressure':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case 'eye':
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    case 'cloud':
      return <svg {...props}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>;
    case 'compass':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
    default:
      return null;
  }
}
