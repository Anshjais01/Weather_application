import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import LocationSelector from './components/LocationSelector';
import SavedLocations from './components/SavedLocations';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import WeatherForecast from './components/WeatherForecast';
import WeatherHistory from './components/WeatherHistory';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import {
  getFullWeather,
  getFullWeatherByCoords,
  getSavedLocations,
  saveLocation,
  removeLocation,
  setDefaultLocation,
  getDefaultLocation,
  getPreferredUnit,
  setPreferredUnit,
} from './services/weatherApi';

/**
 * App – Root component.
 *
 * On mount:
 *   1. Check for a saved default location → load it
 *   2. Otherwise, fall back to London
 *
 * Features:
 *   - Search any city
 *   - GPS geolocation
 *   - Save multiple locations
 *   - Set a default location (loaded on next visit)
 *   - Dynamic backgrounds based on weather
 */
const FALLBACK_CITY = 'London';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [activeCity, setActiveCity] = useState('');
  const [savedLocations, setSavedLocations] = useState(getSavedLocations());
  const [unit, setUnit] = useState(getPreferredUnit);

  /* ── Temperature unit toggle ────────────── */
  function handleUnitChange(newUnit) {
    setUnit(newUnit);
    setPreferredUnit(newUnit);
  }

  /* ── Fetch weather by city name ──────────── */
  const fetchWeather = useCallback(async (city) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFullWeather(city);
      setWeatherData(data);
      setActiveCity(data.current.city);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Fetch weather by GPS coords ─────────── */
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFullWeatherByCoords(lat, lon);
      setWeatherData(data);
      setActiveCity(data.current.city);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsLocating(false);
    }
  }, []);

  /* ── Initial load: default location or fallback ── */
  useEffect(() => {
    const defaultLoc = getDefaultLocation();
    if (defaultLoc) {
      fetchWeather(defaultLoc.city);
    } else {
      fetchWeather(FALLBACK_CITY);
    }
  }, [fetchWeather]);

  /* ── GPS: Get current location ───────────── */
  function handleGps() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Unable to get your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  /* ── Save / Remove / Default Location ────── */
  function handleSave() {
    if (!weatherData?.current) return;
    const { city, country, lat, lon } = weatherData.current;
    const isSaved = savedLocations.some((l) => l.city.toLowerCase() === city.toLowerCase());

    if (isSaved) {
      const updated = removeLocation(city);
      setSavedLocations(updated);
    } else {
      const updated = saveLocation({ city, country, lat, lon });
      setSavedLocations(updated);
    }
  }

  function handleRemoveSaved(cityName) {
    const updated = removeLocation(cityName);
    setSavedLocations(updated);
  }

  function handleSetDefault(cityName) {
    const updated = setDefaultLocation(cityName);
    setSavedLocations(updated);
  }

  /* ── Derived state ──────────────────────── */
  const isSaved = weatherData?.current
    ? savedLocations.some((l) => l.city.toLowerCase() === weatherData.current.city.toLowerCase())
    : false;

  const isDefault = weatherData?.current
    ? savedLocations.some(
        (l) => l.city.toLowerCase() === weatherData.current.city.toLowerCase() && l.isDefault
      )
    : false;

  const mood = weatherData?.current?.mood || 'clear';

  return (
    <div className={`app mood-bg-${mood}`}>
      <Navbar
        onGpsClick={handleGps}
        isLocating={isLocating}
        unit={unit}
        onUnitChange={handleUnitChange}
      />

      <main className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <SearchBar onSearch={fetchWeather} isLoading={isLoading} />
          <div className="search-row">
            <LocationSelector onSelect={fetchWeather} activeCity={activeCity} />
          </div>
        </div>

        {/* Layout: weather content + saved sidebar */}
        <div className="app-layout">
          <div className="app-primary">
            {/* Loading */}
            {isLoading && !weatherData && <Loading />}

            {/* Error */}
            {error && (
              <ErrorMessage message={error} onRetry={() => fetchWeather(activeCity || FALLBACK_CITY)} />
            )}

            {/* Weather */}
            {weatherData && (
              <div className={`weather-content ${isLoading ? 'weather-loading' : ''}`}>
                <CurrentWeather
                  data={weatherData.current}
                  onSave={handleSave}
                  isSaved={isSaved}
                  onSetDefault={() => handleSetDefault(weatherData.current.city)}
                  isDefault={isDefault}
                  unit={unit}
                  onToggleUnit={() => handleUnitChange(unit === 'C' ? 'F' : 'C')}
                />

                <WeatherDetails
                  data={weatherData.current}
                  hourly={weatherData.forecast?.hourly}
                  unit={unit}
                />

                <div className="timeline-sections">
                  <WeatherHistory data={weatherData.history} unit={unit} />
                  <WeatherForecast data={weatherData.forecast?.daily} unit={unit} />
                </div>
              </div>
            )}
          </div>

          {/* Saved Locations Sidebar */}
          {savedLocations.length > 0 && (
            <SavedLocations
              locations={savedLocations}
              onSelect={fetchWeather}
              onRemove={handleRemoveSaved}
              onSetDefault={handleSetDefault}
              activeCity={activeCity}
            />
          )}
        </div>
      </main>

      <footer className="app-footer" id="app-footer">
        <p>Made with ❤️ by Maghi Tech</p>
      </footer>
    </div>
  );
}
