import { useEffect, useState } from 'react';
import { fetchBanks } from '../services/supabaseService';

interface SelectorOption {
  label: string;
  value: string;
}

export function useBanks() {
  const [banks, setBanks] = useState<SelectorOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchBanks()
      .then((banksData) => {
        const mapped = banksData.map((b) => ({ label: b.name, value: String(b.id) }));
        setBanks(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { banks, loading, error };
} 