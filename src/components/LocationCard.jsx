import { convertTemp } from '../services/weatherApi';

/**
 * LocationCard – Reusable card for displaying a location with weather preview.
 */
export default function LocationCard({ city, country, temp, icon, description, onClick, unit = 'C' }) {
  return (
    <button
      className="location-card"
      onClick={() => onClick(city)}
      id={`location-card-${city.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div className="location-card-info">
        <span className="location-card-city">{city}</span>
        <span className="location-card-country">{country}</span>
        <span className="location-card-desc">{description}</span>
      </div>
      <div className="location-card-weather">
        {icon && <img src={icon} alt={description} width="40" height="40" loading="lazy" />}
        {temp !== undefined && <span className="location-card-temp">{convertTemp(temp, unit)}°</span>}
      </div>
    </button>
  );
}
