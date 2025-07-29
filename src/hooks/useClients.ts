import { useState, useEffect, useCallback } from 'react';
import { fetchClients } from '../services/supabaseService';
import { Client } from '../types/supabaseTypes';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Error loading clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Función para recargar clientes
  const refreshClients = useCallback(async () => {
    await loadClients();
  }, [loadClients]);

  // Función para obtener clientes en formato de selector
  const getClientsForSelector = () => {
    return clients.map(client => ({
      label: client.name,
      value: client.id.toString()
    }));
  };

  return { clients, loading, error, getClientsForSelector, refreshClients };
}; 