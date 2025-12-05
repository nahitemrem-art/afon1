import { useEffect, useState } from 'react';
import { storage } from '../services';

export const useOfflineCache = <T>(key: string, fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cachedData = await storage.get<T>(key);
        
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
        }

        const freshData = await fetchFn();
        setData(freshData);
        await storage.set(key, freshData);
      } catch (err) {
        setError(err as Error);
        const cachedData = await storage.get<T>(key);
        if (cachedData) {
          setData(cachedData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key]);

  return { data, isLoading, error };
};
