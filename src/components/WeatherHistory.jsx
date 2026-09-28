import { convertTemp } from '../services/weatherApi';

/**
 * WeatherHistory – Past 4 days, matching the forecast layout for consistency.
 */
export default function WeatherHistory({ data, unit = 'C' }) {
  if (!data || data.length === 0) return null;

  const allMax = Math.max(...data.map((d) => d.tempMax));
  const allMin = Math.min(...data.map((d) => d.tempMin));
  const range = allMax - allMin || 1;

  return (
    <section className="weather-history" id="weather-history">
      <h3 className="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Past 4 Days
      </h3>
      <div className="history-list">
        {data.map((day) => {
          const lowPct = ((day.tempMin - allMin) / range) * 100;
          const highPct = ((day.tempMax - allMin) / range) * 100;

          return (
            <div className="history-row" key={day.date} id={`history-${day.date}`}>
              <div className="history-day-info">
                <span className="history-day">{day.dayName}</span>
                <span className="history-date">
                  {new Date(day.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <img src={day.icon} alt={day.description} className="history-icon" width="42" height="42" loading="lazy" />

              <span className="history-desc">{day.description}</span>

              <div className="history-temp-bar-wrap">
                <span className="history-low">{convertTemp(day.tempMin, unit)}°</span>
                <div className="history-temp-bar">
                  <div
                    className="history-temp-bar-fill"
                    style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
                  />
                </div>
                <span className="history-high">{convertTemp(day.tempMax, unit)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
