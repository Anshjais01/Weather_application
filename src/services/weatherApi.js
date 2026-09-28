/**
 * Weather API Service
 *
 * Uses OpenWeatherMap for current weather and 5-day forecast,
 * and Open-Meteo (free, no key needed) for historical weather data.
 *
 * API Docs:
 *   - https://openweathermap.org/api
 *   - https://open-meteo.com/en/docs
 */

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';
const OWM_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const METEO_BASE = 'https://api.open-meteo.com/v1';

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */

/** Format a Date object as YYYY-MM-DD */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the short day name from a date string or Date object */
function getDayName(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Build an OpenWeatherMap icon URL (high-res) */
function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Convert Celsius to Fahrenheit.
 */
export function cToF(celsius) {
  if (celsius === null || celsius === undefined || Number.isNaN(Number(celsius))) return celsius;
  return Math.round((Number(celsius) * 9) / 5 + 32);
}

/**
 * Convert temperature based on target unit ('C' or 'F').
 * Input is assumed to be in Celsius (base unit returned by our API service).
 */
export function convertTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || Number.isNaN(Number(celsius))) return '--';
  return unit === 'F' ? cToF(celsius) : Math.round(Number(celsius));
}

const UNIT_STORAGE_KEY = 'weathernow_temp_unit';

/**
 * Get preferred temperature unit ('C' or 'F') from localStorage.
 */
export function getPreferredUnit() {
  try {
    return localStorage.getItem(UNIT_STORAGE_KEY) || 'C';
  } catch {
    return 'C';
  }
}

/**
 * Save preferred temperature unit ('C' or 'F') to localStorage.
 */
export function setPreferredUnit(unit) {
  try {
    localStorage.setItem(UNIT_STORAGE_KEY, unit);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Determine the atmospheric "mood" from an OWM weather ID.
 * This drives the dynamic background.
 *
 * OWM condition codes: https://openweathermap.org/weather-conditions
 */
export function getWeatherMood(weatherId, iconCode) {
  const isNight = iconCode?.endsWith('n');

  if (weatherId >= 200 && weatherId < 300) return isNight ? 'thunderstorm-night' : 'thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return isNight ? 'drizzle-night' : 'drizzle';
  if (weatherId >= 500 && weatherId < 600) return isNight ? 'rain-night' : 'rain';
  if (weatherId >= 600 && weatherId < 700) return isNight ? 'snow-night' : 'snow';
  if (weatherId >= 700 && weatherId < 800) return isNight ? 'mist-night' : 'mist';
  if (weatherId === 800) return isNight ? 'clear-night' : 'clear';
  if (weatherId > 800 && weatherId < 804) return isNight ? 'clouds-night' : 'clouds';
  if (weatherId === 804) return isNight ? 'overcast-night' : 'overcast';

  return isNight ? 'clear-night' : 'clear';
}

/**
 * Map Open-Meteo WMO weather codes to descriptions and OWM-style icons.
 */
function mapWmoCode(code) {
  const map = {
    0:  { description: 'Clear sky',            icon: '01d', id: 800 },
    1:  { description: 'Mainly clear',         icon: '01d', id: 800 },
    2:  { description: 'Partly cloudy',        icon: '02d', id: 802 },
    3:  { description: 'Overcast',             icon: '04d', id: 804 },
    45: { description: 'Fog',                  icon: '50d', id: 741 },
    48: { description: 'Depositing rime fog',  icon: '50d', id: 741 },
    51: { description: 'Light drizzle',        icon: '09d', id: 300 },
    53: { description: 'Moderate drizzle',     icon: '09d', id: 301 },
    55: { description: 'Dense drizzle',        icon: '09d', id: 302 },
    61: { description: 'Slight rain',          icon: '10d', id: 500 },
    63: { description: 'Moderate rain',        icon: '10d', id: 501 },
    65: { description: 'Heavy rain',           icon: '10d', id: 502 },
    71: { description: 'Slight snow',          icon: '13d', id: 600 },
    73: { description: 'Moderate snow',        icon: '13d', id: 601 },
    75: { description: 'Heavy snow',           icon: '13d', id: 602 },
    77: { description: 'Snow grains',          icon: '13d', id: 611 },
    80: { description: 'Slight rain showers',  icon: '09d', id: 520 },
    81: { description: 'Moderate rain showers',icon: '09d', id: 521 },
    82: { description: 'Violent rain showers', icon: '09d', id: 522 },
    85: { description: 'Slight snow showers',  icon: '13d', id: 620 },
    86: { description: 'Heavy snow showers',   icon: '13d', id: 621 },
    95: { description: 'Thunderstorm',         icon: '11d', id: 200 },
    96: { description: 'Thunderstorm w/ hail', icon: '11d', id: 201 },
    99: { description: 'Thunderstorm w/ heavy hail', icon: '11d', id: 202 },
  };
  return map[code] || { description: 'Unknown', icon: '01d', id: 800 };
}

/* ──────────────────────────────────────────
   OpenWeatherMap — Current Weather by City
   ────────────────────────────────────────── */

export async function getCurrentWeather(city) {
  const url = `${OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) throw new Error(`City "${city}" not found. Check the spelling and try again.`);
    if (res.status === 401) throw new Error('Invalid API key. Please check your configuration.');
    throw new Error('Unable to fetch weather data. Please try again later.');
  }

  const data = await res.json();
  return normalizeCurrentWeather(data);
}

/* ──────────────────────────────────────────
   OpenWeatherMap — Current Weather by Coords (GPS)
   ────────────────────────────────────────── */

export async function getCurrentWeatherByCoords(lat, lon) {
  const url = `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(url);

  if (!res.ok) throw new Error('Unable to fetch weather for your location.');

  const data = await res.json();
  return normalizeCurrentWeather(data);
}

/** Shared normalizer for OWM current weather responses */
function normalizeCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    clouds: data.clouds.all,
    description: data.weather[0].description,
    icon: getWeatherIcon(data.weather[0].icon),
    iconCode: data.weather[0].icon,
    weatherId: data.weather[0].id,
    main: data.weather[0].main,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    dt: data.dt,
    timezone: data.timezone,
    mood: getWeatherMood(data.weather[0].id, data.weather[0].icon),
  };
}

/* ──────────────────────────────────────────
   OpenWeatherMap — 5-day / 3-hour Forecast
   ────────────────────────────────────────── */

export async function getForecast(city) {
  const url = `${OWM_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch forecast data.');
  const data = await res.json();
  return normalizeForecast(data);
}

export async function getForecastByCoords(lat, lon) {
  const url = `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch forecast data.');
  const data = await res.json();
  return normalizeForecast(data);
}

function normalizeForecast(data) {
  // Group 3-hour intervals by date
  const grouped = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  const today = formatDate(new Date());
  const dailyForecasts = Object.entries(grouped)
    .filter(([date]) => date !== today)
    .slice(0, 4)
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const feelsLikes = items.map((i) => i.main.feels_like);
      const humidities = items.map((i) => i.main.humidity);
      const winds = items.map((i) => i.wind.speed);
      const midday = items.find((i) => i.dt_txt.includes('12:00')) || items[Math.floor(items.length / 2)];

      return {
        date,
        dayName: getDayName(date),
        tempMax: Math.round(Math.max(...temps)),
        tempMin: Math.round(Math.min(...temps)),
        feelsLike: Math.round(feelsLikes.reduce((a, b) => a + b, 0) / feelsLikes.length),
        humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
        windSpeed: (winds.reduce((a, b) => a + b, 0) / winds.length).toFixed(1),
        description: midday.weather[0].description,
        icon: getWeatherIcon(midday.weather[0].icon),
        main: midday.weather[0].main,
        weatherId: midday.weather[0].id,
      };
    });

  const hourly = data.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    icon: getWeatherIcon(item.weather[0].icon),
    description: item.weather[0].description,
    windSpeed: item.wind.speed,
    humidity: item.main.humidity,
  }));

  return { daily: dailyForecasts, hourly };
}

/* ──────────────────────────────────────────
   Open-Meteo — Historical Weather (free)
   ────────────────────────────────────────── */

export async function getHistoricalWeather(lat, lon, days = 4) {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    start_date: formatDate(start),
    end_date: formatDate(end),
    daily: 'temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max,weathercode,sunrise,sunset',
    timezone: 'auto',
  });

  const url = `${METEO_BASE}/forecast?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unable to fetch historical weather data.');

  const data = await res.json();
  const { daily } = data;

  return daily.time.map((date, i) => {
    const wmo = mapWmoCode(daily.weathercode[i]);
    return {
      date,
      dayName: getDayName(date),
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      feelsLike: Math.round(
        (daily.apparent_temperature_max[i] + daily.apparent_temperature_min[i]) / 2
      ),
      precipitation: daily.precipitation_sum[i],
      windSpeed: daily.windspeed_10m_max[i],
      description: wmo.description,
      icon: getWeatherIcon(wmo.icon),
      main: wmo.description,
      sunrise: daily.sunrise[i]
        ? new Date(daily.sunrise[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '--',
      sunset: daily.sunset[i]
        ? new Date(daily.sunset[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '--',
    };
  });
}

/* ──────────────────────────────────────────
   OpenWeatherMap — City Search (Geocoding)
   ────────────────────────────────────────── */

/**
 * Search for cities by name using the OWM Geocoding API.
 * Returns up to `limit` suggestions with city, state, country, and coords.
 */
export async function searchCities(query, limit = 5) {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEO_BASE}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${OWM_KEY}`;
  const res = await fetch(url);

  if (!res.ok) return [];

  const data = await res.json();

  // Deduplicate by city+country (API can return near-duplicates)
  const seen = new Set();
  return data
    .filter((item) => {
      const key = `${item.name}-${item.country}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => ({
      name: item.name,
      state: item.state || '',
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      displayName: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
    }));
}

/* ──────────────────────────────────────────
   Composite: Fetch Everything
   ────────────────────────────────────────── */

export async function getFullWeather(city) {
  const current = await getCurrentWeather(city);
  const [forecast, history] = await Promise.all([
    getForecast(city),
    getHistoricalWeather(current.lat, current.lon, 4),
  ]);
  return { current, forecast, history };
}

export async function getFullWeatherByCoords(lat, lon) {
  const current = await getCurrentWeatherByCoords(lat, lon);
  const [forecast, history] = await Promise.all([
    getForecastByCoords(lat, lon),
    getHistoricalWeather(lat, lon, 4),
  ]);
  return { current, forecast, history };
}

/* ──────────────────────────────────────────
   Saved Locations (localStorage)
   ────────────────────────────────────────── */

const STORAGE_KEY = 'weathernow_saved_locations';

export function getSavedLocations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocation(location) {
  const locations = getSavedLocations();
  // Prevent duplicates by city name
  const exists = locations.find(
    (l) => l.city.toLowerCase() === location.city.toLowerCase()
  );
  if (exists) return locations;

  const updated = [...locations, { ...location, isDefault: locations.length === 0 }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeLocation(cityName) {
  const locations = getSavedLocations();
  const updated = locations.filter(
    (l) => l.city.toLowerCase() !== cityName.toLowerCase()
  );
  // If we removed the default, make the first one default
  if (updated.length > 0 && !updated.some((l) => l.isDefault)) {
    updated[0].isDefault = true;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function setDefaultLocation(cityName) {
  const locations = getSavedLocations();
  const updated = locations.map((l) => ({
    ...l,
    isDefault: l.city.toLowerCase() === cityName.toLowerCase(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getDefaultLocation() {
  const locations = getSavedLocations();
  return locations.find((l) => l.isDefault) || null;
}
