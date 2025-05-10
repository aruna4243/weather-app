const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

import { WeatherData } from '@/types/weather';

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
};

export async function getWeatherByCoords(lat: number, lon: number) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch location weather");
  return res.json();
}

export const getFiveDayForecast = async (city: string) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    
    if (data.cod !== "200") {
      throw new Error("Failed to fetch weather data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
