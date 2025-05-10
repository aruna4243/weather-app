// hooks/useRawForecast.ts
import { useEffect, useState } from 'react';
import { getFiveDayForecast } from '@/lib/weatherApi';
import { ForecastEntry } from '@/types/weather';

export default function useRawForecast(city: string) {
  const [rawList, setRawList] = useState<ForecastEntry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFiveDayForecast(city); 
        setRawList(data.list);
      } catch (err) {
        setError('Failed to fetch raw forecast');
        console.error(err);
      }
    };

    if (city) fetchData();
  }, [city]);

  return { rawList, error };
}
