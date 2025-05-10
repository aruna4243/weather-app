import { useEffect, useState } from "react";
import { useTheme } from 'next-themes';
import Header from "./header";
import WeatherCard from "./weatherCard";
import WeeklyForecast from "./weeklyForecast";
import useGeoWeather from "@/hooks/useGeoWeather";
import { getWeatherByCity } from "@/lib/weatherApi";
import { WeatherData } from "@/types/weather";
import Highlights from "./highlights";
import Chart from "./chart";
import FavoriteCities from "./favoriteCity";


export default function WeatherDashboard() {
  const { theme } = useTheme(); 

  const { weather: geoWeather, loading, error } = useGeoWeather();
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [searchError, setSearchError] = useState("");
  const [city, setCity] = useState("");
  const [mounted, setMounted] = useState(false);


 

  useEffect(() => {
    if (geoWeather && !city) {
      setCity(geoWeather?.name);
    }
  }, [geoWeather, city]);

  const handleSearch = async (query: string) => {
    try {
      const data = await getWeatherByCity(query);
      setCityWeather(data);
      setCity(query);
      setSearchError("");
    } catch {
      setSearchError("Location not found.");
    }
  };

  const displayWeather = cityWeather || geoWeather;
    useEffect(() => {
    setMounted(true);
  }, []);

 if (!mounted) return null;
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#424242] text-[#f5f5f5]' : 'bg-[#eceff1]  text-black'}  flex flex-col`}>
      <Header />

    <main className="flex-grow grid grid-cols-1 xl:grid-cols-12  px-4 gap-4">
  {/*WeatherCard */}
  <div className="xl:col-span-3 flex flex-col">
    <div className={`flex-grow rounded-xl shadow overflow-hidden ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'} p-2`}>
      {loading && <p>Loading weather data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchError && <p className="text-red-500">{searchError}</p>}
      {displayWeather ? (
        <WeatherCard data={displayWeather} onSearch={handleSearch} />
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  </div>

  {/* WeeklyForecast */}
  <div className="xl:col-span-5 flex flex-col">
    <div className={`flex-grow rounded-xl shadow overflow-hidden ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'} p-2`}>
      <WeeklyForecast  city={city} />
    </div>
  </div>

  {/*Chart */}
  <div className="xl:col-span-4 flex flex-col">
    <div className={`flex-grow rounded-xl shadow overflow-hidden ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'} p-2`}>
      <Chart  city={city} />
    </div>
  </div>

  {/* Highlights */}
  <div className={`rounded-xl shadow p-4 xl:mb-4 overflow-auto xl:col-span-7 ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'}`}>
    {displayWeather && <Highlights data={displayWeather} />}
  </div>

  {/* Favorites */}
  <div className={`rounded-xl shadow p-4 xl:mb-4 overflow-auto xl:col-span-5 ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'}`}>
    {displayWeather && <FavoriteCities />}
  </div>
</main>

    </div>
  );
}
