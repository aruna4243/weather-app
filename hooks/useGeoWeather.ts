import { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';

export default function useGeoWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
          );
          if (!res.ok) throw new Error('Failed to fetch location weather');
          const data = await res.json();

          const mappedData: WeatherData = {
            name: data.name,
            main: {
              temp: data.main.temp,
              feels_like: data.main.feels_like,
              temp_min: data.main.temp_min,
              temp_max: data.main.temp_max,
              humidity: data.main.humidity,
              pressure: data.main.pressure,
              sea_level: 0,
              grnd_level: 0
            },
            weather: data.weather,
            wind: {
              speed: data.wind.speed,
              deg: 0,
              gust: 0
            },
            sys: {
              sunrise: data.sys.sunrise,
              sunset: data.sys.sunset,
              country: data.sys.country,
              type: 0,
              id: 0
            },
            coord: {
              lon: 0,
              lat: 0
            },
            base: '',
            visibility: 0,
            clouds: {
              all: 0
            },
            dt: 0,
            timezone: 0,
            id: 0,
            cod: 0
          };

          setWeather(mappedData);
        } catch {
          setError('Could not fetch location weather.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Geolocation permission denied.');
        setLoading(false);
      }
    );
  }, []);

  return { weather, loading, error };
}
