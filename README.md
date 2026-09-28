# ☀️ WeatherNow

A clean, modern weather application built with **React + Vite** that provides real-time weather data, 4-day forecasts, and historical weather information for any city worldwide.

![WeatherNow](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Real-time weather** – Current temperature, conditions, humidity, wind, pressure and more
- **4-day forecast** – Daily high/low, conditions, and wind data
- **4-day history** – Past weather from the Open-Meteo archive
- **Hourly forecast** – Next 24 hours in 3-hour intervals
- **City search** – Search any city worldwide
- **Quick-access cities** – One-click popular city shortcuts
- **Responsive design** – Looks great on desktop, tablet, and mobile
- **Clean, professional UI** – No clutter, no gimmicks

## 🛠 Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Framework  | React 19                                  |
| Build tool | Vite 8                                    |
| Language   | JavaScript (ES Modules)                   |
| Styling    | Vanilla CSS (custom design system)        |
| APIs       | OpenWeatherMap (current + forecast)       |
|            | Open-Meteo (historical weather, free)     |
| Fonts      | Inter (Google Fonts)                      |

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx            # Top navigation bar
│   ├── SearchBar.jsx         # City search input
│   ├── LocationSelector.jsx  # Popular city chips
│   ├── CurrentWeather.jsx    # Main weather hero section
│   ├── WeatherDetails.jsx    # Detailed metrics + hourly strip
│   ├── WeatherForecast.jsx   # 4-day future forecast
│   ├── WeatherHistory.jsx    # 4-day historical data
│   ├── LocationCard.jsx      # Reusable location card
│   ├── Loading.jsx           # Loading spinner
│   └── ErrorMessage.jsx      # Error display
│
├── services/
│   └── weatherApi.js         # All API calls in one place
│
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
└── index.css                 # Global styles & design system
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/weathernow.git
cd weathernow

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Then edit .env and add your OpenWeatherMap API key

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`.

### Environment Variables

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `VITE_WEATHER_API_KEY`| Your OpenWeatherMap API key          |

### Build for Production

```bash
npm run build    # Output goes to dist/
npm run preview  # Preview the production build
```

## 🎨 Design Philosophy

WeatherNow follows a **calm, professional, atmospheric** design language:

- **Palette**: Deep navy (`#0f1b2d`), slate blues, sky blue accents, clean whites
- **Typography**: Inter — clean, modern, highly readable
- **Spacing**: Generous whitespace, consistent 4px grid
- **Motion**: Subtle fade-in animations and hover micro-interactions
- **Shadows**: Soft, layered — never harsh

## 📡 APIs Used

1. **OpenWeatherMap** (requires free API key)
   - Current Weather: `/data/2.5/weather`
   - 5-Day Forecast: `/data/2.5/forecast`

2. **Open-Meteo** (free, no API key needed)
   - Historical weather archive for past 4 days

---

Made with ❤️ by Maghi Tech
