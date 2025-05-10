"use client";

import { useEffect, useState } from "react";
import { getWeatherByCity } from "@/lib/weatherApi";
import { WeatherData } from "@/types/weather";
import WeatherCardMini from "./miniWeatherCard";
import { FaCity } from "react-icons/fa";
import { useTheme } from 'next-themes';

const defaultCities = ["New York", "London", "Tokyo", "Paris", "Sydney"];
const MAX_FAVORITES = 3;



export default function FavoriteCities() {
  
  const [weatherList, setWeatherList] = useState<WeatherData[]>([]);
 const { theme} = useTheme();
  const isDark = theme === "dark";
  const headingColor = isDark ? "text-white" : "text-gray-800";
  const iconColor = isDark ? "text-blue-400" : "text-blue-600";

  const loadWeather = async (cityList: string[]) => {
    try {
      const weatherData = await Promise.all(cityList.map(city => getWeatherByCity(city)));
      setWeatherList(weatherData);
    } catch (err) {
      console.error("Error fetching weather for favorites:", err);
    }
  };

  const updateCities = (favorites: string[]) => {
    let updatedCities = favorites.slice(-MAX_FAVORITES);
    if (updatedCities.length < MAX_FAVORITES) {
      updatedCities = [
        ...updatedCities,
        ...defaultCities.filter(city => !updatedCities.includes(city)).slice(0, MAX_FAVORITES - updatedCities.length)
      ];
    }
    
    loadWeather(updatedCities);
  };

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    const savedCities: string[] = stored ? JSON.parse(stored) : [];

    if (savedCities.length > 0) {
      updateCities(savedCities);
    } else {
      updateCities([]);
    }

    const handleFavoritesUpdated = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      updateCities(updatedFavorites);
    };

    window.addEventListener("favorites-updated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favorites-updated", handleFavoritesUpdated);
    };
  }, []);

  return (
    <div className="px-2">
   
      <div className="flex items-center mb-4 space-x-2">
        <FaCity className={`text-2xl ${iconColor}`} />
        <h2 className={`text-xl font-semibold ${headingColor}`}>Favorite Cities</h2>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherList.map((weather, index) =>
          weather?.weather?.[0] ? (
            <WeatherCardMini key={weather.id || index} data={weather}  />
          ) : null
        )}
      </div>
    </div>
  );
}
