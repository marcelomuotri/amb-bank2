import { useEffect, useState } from 'react';
import { fetchClients } from '../services/supabaseService';

interface SelectorOption {
  label: string;
  value: string;
}

export function useClients() {
  const [clients, setClients] = useState<SelectorOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchClients()
      .then((clientsData) => {
        const mapped = clientsData.map((c) => ({ label: c.name, value: String(c.id) }));
        setClients(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { clients, loading, error };
} 