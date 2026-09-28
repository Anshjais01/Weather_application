/**
 * SavedLocations – Sidebar/panel showing saved locations.
 * Allows removing locations and switching default.
 */
export default function SavedLocations({ locations, onSelect, onRemove, onSetDefault, activeCity }) {
  if (!locations || locations.length === 0) return null;

  return (
    <aside className="saved-locations" id="saved-locations">
      <div className="saved-header">
        <h3 className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Saved Locations
        </h3>
        <span className="saved-count">{locations.length}</span>
      </div>

      <div className="saved-list">
        {locations.map((loc) => (
          <div
            className={`saved-card ${activeCity?.toLowerCase() === loc.city.toLowerCase() ? 'active' : ''} ${loc.isDefault ? 'is-default' : ''}`}
            key={loc.city}
            id={`saved-${loc.city.toLowerCase().replace(/\s/g, '-')}`}
          >
            <button
              className="saved-card-main"
              onClick={() => onSelect(loc.city)}
            >
              <div className="saved-card-info">
                <span className="saved-city">{loc.city}</span>
                <span className="saved-country">{loc.country}</span>
              </div>
              {loc.isDefault && (
                <span className="default-badge">Default</span>
              )}
            </button>

            <div className="saved-card-actions">
              {!loc.isDefault && (
                <button
                  className="saved-action-btn"
                  onClick={(e) => { e.stopPropagation(); onSetDefault(loc.city); }}
                  title="Set as default"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </button>
              )}
              <button
                className="saved-action-btn remove"
                onClick={(e) => { e.stopPropagation(); onRemove(loc.city); }}
                title="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
