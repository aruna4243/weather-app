"use client";
import { useEffect, useState } from "react";
import { WeatherData } from "@/types/weather";
import { Tooltip } from 'react-tooltip';
import { useTheme } from 'next-themes';

import {
  FaMapMarkerAlt,
  FaSun,
  FaMoon,
  FaSearch,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";


function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

interface WeatherCardProps {
  data: WeatherData;
  onSearch: (query: string) => void;
}

export default function WeatherCard({ data, onSearch }: WeatherCardProps) {
  const { theme} = useTheme();
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(data.name);
const [localDate, setLocalDate] = useState("");

useEffect(() => {
  const formatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  setLocalDate(formatted);
}, []);
  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const handleSearch = (query: string) => {
    onSearch(query);
    setInput("");
  };

  const temperature =
    unit === "metric"
      ? Math.round(data.main.temp)
      : Math.round(data.main.temp * 1.8 + 32);

  const high =
    unit === "metric"
      ? Math.round(data.main.temp_max)
      : Math.round(data.main.temp_max * 1.8 + 32);
  const low =
    unit === "metric"
      ? Math.round(data.main.temp_min)
      : Math.round(data.main.temp_min * 1.8 + 32);

  return (
   <div className={`${theme === 'dark' ? 'bg-[#212121] text-[#f5f5f5] border-none' : 'bg-white  text-black  border-gray-300'} rounded-2xl p-4  w-full mx-auto flex flex-col gap-4 `}>
  {/* Date & Unit Toggle */}
  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
    <h2 className="text-lg sm:text-xl font-semibold">
      {localDate}
    </h2>

    <div className="flex items-center space-x-2 self-start sm:self-auto">
      <button
        className={`px-3 py-1 text-sm font-medium rounded-full transition ${
          unit === "metric"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
        }`}
        onClick={toggleUnit}
      >
        °C
      </button>
      <button
        className={`px-3 py-1 text-sm font-medium rounded-full transition ${
          unit === "imperial"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
        }`}
        onClick={toggleUnit}
      >
        °F
      </button>
    </div>
  </div>

  {/* Location and Search */}
  <div className="flex flex-col sm:flex-row justify-between gap-3">
    <div className="flex items-center gap-2">
      <FaMapMarkerAlt className="text-blue-500 text-xl" />
      <div className="flex items-center gap-1">
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <div className="px-1">
          <span
            data-tooltip-id="fav-tooltip"
            data-tooltip-content={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            className="cursor-pointer text-xl"
            onClick={() =>
              isFavorite ? removeFavorite(data.name) : addFavorite(data.name)
            }
          >
            {isFavorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className={` ${theme === 'dark' ? 'text-gray-300  hover:text-red-300'  : 'text-gray-500 hover:text-red-400'}`} />
            )}
          </span>
          <Tooltip id="fav-tooltip" place="bottom" />
        </div>
      </div>
    </div>

    <div className={`relative flex items-center border rounded-md overflow-hidden  ${theme === 'dark' ? ' bg-gray-800'  : ' bg-gray-100'}`}>
      <input
        type="text"
        placeholder="Search city..."
        className="px-3 py-1 text-sm w-full sm:w-40 dark:bg-transparent focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) handleSearch(input.trim());
        }}
      />
      <button
        onClick={() => input.trim() && handleSearch(input.trim())}
        className="px-3 text-gray-500 hover:text-gray-700 dark:hover:text-white"
      >
        <FaSearch />
      </button>
    </div>
  </div>

  {/* Temperature and Icon */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div>
      <h1 className="text-6xl sm:text-7xl font-bold">
        {temperature}°{unit === "metric" ? "C" : "F"}
      </h1>
      <p className={`capitalize ${theme === 'dark' ? 'text-gray-100'  : ' text-gray-600'} text-base sm:text-lg`}>
        {data.weather[0].description}
      </p>
      <p className={`text-sm mt-1 font-bold ${theme === 'dark' ? 'text-gray-400'  : ' text-gray-700'} `}>
        H: {high}° L: {low}°
      </p>
    </div>
    <img
      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
      alt={data.weather[0].description}
      className="w-28 h-28 sm:w-36 sm:h-36"
    />
  </div>

  {/* Sunrise & Sunset */}
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-[#333333]'  : 'bg-gray-100'} px-3 py-2 rounded-md shadow-sm`}>
      <FaSun className="text-yellow-400 text-base" />
      <span>Sunrise: {formatTime(data.sys.sunrise)}</span>
    </div>
    <div className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-[#333333]'  : 'bg-gray-100'} px-3 py-2 rounded-md shadow-sm`}>
      <FaMoon className="text-indigo-400 text-base" />
      <span>Sunset: {formatTime(data.sys.sunset)}</span>
    </div>
  </div>
  {/* Weather Tip */}
<div className={`mt-4 p-3 rounded-md  ${theme === 'dark' ? 'bg-[#333333]' : 'bg-blue-50'} text-sm`}>
  <p className="font-medium">Tip:</p>
  <p>
    {data.weather[0].main === "Rain" && "Don’t forget your umbrella today!"}
    {data.weather[0].main === "Clear" && "Great day for outdoor activities, but don’t forget sunscreen!"}
    {data.weather[0].main === "Snow" && "Wear warm clothes and drive safely!"}
    {data.weather[0].main === "Clouds" && "Mild day ahead. Good for a walk!"}
    {!["Rain", "Clear", "Snow", "Clouds"].includes(data.weather[0].main) && "Check hourly forecast for detailed planning."}
  </p>
</div>

</div>

  );
}
