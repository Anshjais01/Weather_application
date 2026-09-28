import { convertTemp } from '../services/weatherApi';

/**
 * WeatherForecast – 4-day future weather with a compact card-row layout.
 */
export default function WeatherForecast({ data, unit = 'C' }) {
  if (!data || data.length === 0) return null;

  // Find the global max/min across all forecast days for the temp bar range
  const allMax = Math.max(...data.map((d) => d.tempMax));
  const allMin = Math.min(...data.map((d) => d.tempMin));
  const range = allMax - allMin || 1;

  return (
    <section className="weather-forecast" id="weather-forecast">
      <h3 className="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        4-Day Forecast
      </h3>
      <div className="forecast-list">
        {data.map((day) => {
          const lowPct = ((day.tempMin - allMin) / range) * 100;
          const highPct = ((day.tempMax - allMin) / range) * 100;

          return (
            <div className="forecast-row" key={day.date} id={`forecast-${day.date}`}>
              <div className="forecast-day-info">
                <span className="forecast-day">{day.dayName}</span>
                <span className="forecast-date">
                  {new Date(day.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <img src={day.icon} alt={day.description} className="forecast-icon" width="42" height="42" loading="lazy" />

              <span className="forecast-desc">{day.description}</span>

              <div className="forecast-temp-bar-wrap">
                <span className="forecast-low">{convertTemp(day.tempMin, unit)}°</span>
                <div className="forecast-temp-bar">
                  <div
                    className="forecast-temp-bar-fill"
                    style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
                  />
                </div>
                <span className="forecast-high">{convertTemp(day.tempMax, unit)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
