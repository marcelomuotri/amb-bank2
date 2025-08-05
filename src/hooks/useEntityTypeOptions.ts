import { useState, useEffect } from 'react';
import { fetchEntityTypeOptions } from '../services/supabaseService';

export const useEntityTypeOptions = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const entityTypeOptions = await fetchEntityTypeOptions();
        setOptions(entityTypeOptions);
      } catch (err) {
        console.error('Error loading entity_type options:', err);
        setError('Error loading entity_type options');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { options, loading, error };
}; 