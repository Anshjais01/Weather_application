/**
 * LocationSelector – Quick-access city chips.
 */
const POPULAR_CITIES = [
  { name: 'London',    emoji: '🇬🇧' },
  { name: 'New York',  emoji: '🇺🇸' },
  { name: 'Tokyo',     emoji: '🇯🇵' },
  { name: 'Paris',     emoji: '🇫🇷' },
  { name: 'Sydney',    emoji: '🇦🇺' },
  { name: 'Dubai',     emoji: '🇦🇪' },
  { name: 'Mumbai',    emoji: '🇮🇳' },
  { name: 'Singapore', emoji: '🇸🇬' },
];

export default function LocationSelector({ onSelect, activeCity }) {
  return (
    <div className="location-selector" id="location-selector">
      <span className="section-label">Popular</span>
      <div className="location-chips">
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            className={`location-chip ${activeCity?.toLowerCase() === city.name.toLowerCase() ? 'active' : ''}`}
            onClick={() => onSelect(city.name)}
            id={`chip-${city.name.toLowerCase().replace(/\s/g, '-')}`}
          >
            <span className="chip-emoji">{city.emoji}</span>
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
