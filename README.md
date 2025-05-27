# Weather Forecast App 

A responsive, dark-themed App that provides current and forecasted weather information using real-time geolocation or city-based search. Built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**, it offers a clean UI with highlights, charts, weekly forecasts, and support for installing the app on devices.

---

##  Features

- **Live Geolocation Weather**: Automatically detects your current location and fetches weather.
- **City Search with Autocomplete**: Search any city with intelligent suggestions via GeoDB API.
-  **5-Day Forecast**: Displays grouped min/max temperatures and summaries.
-  **Temperature Chart**: Visual representation of temperature trends.
- **Favorites**: Save up to 3 favorite cities for quick access.
-  **Dark/Light Theme**: Auto-syncs with system theme using `next-themes`.
-  **PWA Support**: Fully installable on desktop or mobile.

---

##  Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-forecast-app.git
cd weather-forecast-app


### 2. Install Dependencies
npm install

### 3. Create Environment Variables
Create a .env.local file in the root and add:

NEXT_PUBLIC_WEATHER_API_KEY=e8280e42cf96ec99b7e51a6cb83ba9fe


### 4. Run the App Locally

npm run dev


### 5. Manual Deployment (Node/Hosting)

npm run build
npm start





























