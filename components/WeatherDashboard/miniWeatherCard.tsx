"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { WeatherData } from "@/types/weather";
import { FaHeart } from "react-icons/fa";
import {
  WiSunrise,
  WiSunset,
} from "react-icons/wi";

const MAX_FAVORITES = 3;

export default function WeatherCardMini({ data }: { data: WeatherData }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    const favorites: string[] = stored ? JSON.parse(stored) : [];
    setIsFavorite(favorites.includes(data.name));
  }, [data.name]);

  const toggleFavorite = () => {
    const stored = localStorage.getItem("favorites");
    let favorites: string[] = stored ? JSON.parse(stored) : [];

    if (favorites.includes(data.name)) {
      favorites = favorites.filter((city) => city !== data.name);
    } else {
      if (favorites.length < MAX_FAVORITES) {
        favorites.push(data.name);
      } else {
        favorites = [...favorites.slice(1), data.name];
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(favorites.includes(data.name));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`relative rounded-2xl  p-5 flex flex-col text-center space-y-3 transition-colors duration-300 ${
        isDark ? "bg-[#333333] text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
  
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-xl"
        title="Toggle Favorite"
      >
        <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
      </button>

      <h3 className="text-lg font-semibold">{data.name}</h3>

      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
        className="w-16 h-16 mx-auto"
      />
      <p className="text-2xl font-bold">{Math.round(data.main.temp)}°C</p>
      <p className={`text-sm capitalize ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        {data.weather[0].description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm text-left mt-3">
        <div className="flex items-center space-x-2">
          <WiSunrise className="text-yellow-400 text-xl" />
          <span>Sunrise: {formatTime(data.sys.sunrise)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <WiSunset className="text-orange-400 text-xl" />
          <span>Sunset: {formatTime(data.sys.sunset)}</span>
        </div>
      </div>
    </div>
  );
}
