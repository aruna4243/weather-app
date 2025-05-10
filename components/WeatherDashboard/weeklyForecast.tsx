'use client';

import React, { useState, useEffect } from 'react';
import { getFiveDayForecast } from '@/lib/weatherApi';
import { useTheme } from 'next-themes';

interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  summary: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hourlyData: any[];
}

export default function WeeklyForecast({ city }: { city: string }) {
  const { theme } = useTheme();
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!city) return; 
    const fetchData = async () => {
      try {
        const data = await getFiveDayForecast(city);
        const groupedData = groupByDate(data.list);
        setForecastData(groupedData);

        const todayForecast = groupedData.find((day) => day.date === today);
        if (todayForecast) {
          setHourlyData(todayForecast.hourlyData);
          setSelectedDate(todayForecast.date);
        }
      } catch (error) {
        console.error('Error fetching forecast:', error);
      }
    };

    fetchData();
  }, [city, today]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupByDate = (list: any[]) => {
    const grouped: DailyForecast[] = [];
    list.forEach((entry) => {
      const date = entry.dt_txt.split(' ')[0];
      const existing = grouped.find((item) => item.date === date);

      if (existing) {
        existing.tempMin = Math.min(existing.tempMin, entry.main.temp_min);
        existing.tempMax = Math.max(existing.tempMax, entry.main.temp_max);
        existing.icon = entry.weather[0].icon;
        existing.summary = entry.weather[0].description;
        existing.hourlyData.push(entry);
      } else {
        grouped.push({
          date,
          tempMin: entry.main.temp_min,
          tempMax: entry.main.temp_max,
          icon: entry.weather[0].icon,
          summary: entry.weather[0].description,
          hourlyData: [entry],
        });
      }
    });
    return grouped;
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const selectedData = forecastData.find((data) => data.date === date);
    setHourlyData(selectedData ? selectedData.hourlyData : []);
  };

  const hourlyDataFiltered = hourlyData.filter((_, index) => index % 3 === 0);

  const isDark = theme === 'dark';

  return (
    <div className={`w-full rounded-2xl p-2 flex flex-col gap-2 ${isDark ? 'bg-[#212121] text-white' : 'bg-white text-gray-800'}`}>
      {/* Heading */}
      <div className="text-center sm:text-left">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Weekly Forecast for {city}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Tap a day to view hourly weather updates
        </p>
      </div>

      {/* Daily Forecast List */}
      <div className="flex gap-4 overflow-x-auto items-center justify-around p-2">
        {forecastData.map((day) => {
          const isSelected = selectedDate === day.date;
          return (
            <div
              key={day.date}
              className={`min-w-[100px] flex-shrink-0 p-3 rounded-xl text-center cursor-pointer transition-transform transform hover:scale-105
                ${isDark ? (isSelected ? 'bg-[#555555]' : 'bg-[#333333]') : isSelected ? 'bg-blue-200' : 'bg-gray-200'}
              `}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.summary}
                  className="h-12 w-12 object-contain"
                />
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°
                </p>
                <p className={`text-xs truncate w-full ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {day.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Forecast */}
      <div className="overflow-x-auto">
        <h3 className={`text-lg font-semibold px-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Hourly Forecast for{' '}
          {selectedDate &&
            new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
        </h3>

        <div className="flex gap-3 items-center justify-start p-2">
          {hourlyDataFiltered.map((hour, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl shadow-sm min-w-[110px]
                ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}
                ${index === 0 ? 'ml-4' : ''} ${index === hourlyDataFiltered.length - 1 ? 'mr-4' : ''}
              `}
            >
              <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`} suppressHydrationWarning>
                {new Date(hour.dt_txt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
                className="h-10 w-10"
              />
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Math.round(hour.main.temp)}°
              </p>
              <p className={`text-xs text-center truncate text-wrap min-w-[100px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {hour.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
