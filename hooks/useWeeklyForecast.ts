// hooks/useWeeklyForecast.ts
import { useEffect, useState } from 'react';
import { getFiveDayForecast } from '@/lib/weatherApi';

interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  summary: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hourlyData: any[]; 
}

export default function useWeeklyForecast(city: string) {
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
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
      } catch (err) {
        setError('Failed to fetch 5-day forecast');
        console.error(err);
      }
    };

    if (city) fetchData();
  }, [city, today]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupByDate = (list: any[]): DailyForecast[] => {
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
          summary: entry.weather[0].description,
          icon: entry.weather[0].icon,
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

  return {
    forecastData,
    hourlyData,
    selectedDate,
    handleDateClick,
    error,
     rawList: forecastData 
  };
}
