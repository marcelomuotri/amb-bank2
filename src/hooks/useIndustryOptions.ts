import { useState, useEffect } from 'react';
import { fetchIndustryOptions } from '../services/supabaseService';

export const useIndustryOptions = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const industryOptions = await fetchIndustryOptions();
        setOptions(industryOptions);
      } catch (err) {
        console.error('Error loading industry options:', err);
        setError('Error loading industry options');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { options, loading, error };
}; 