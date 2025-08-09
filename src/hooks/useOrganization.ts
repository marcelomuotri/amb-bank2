import { useState, useEffect } from 'react';
import { getOrganizationData } from '../services/supabaseService';
import { FAVICON_CONFIG } from '../config/favicon';

interface Organization {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export const useOrganization = () => {
  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getOrganizationData();
        setOrganizationData(data);
        
        // Actualizar el favicon con el logo de la organización
        if (data?.logo_url) {
          FAVICON_CONFIG.updateFavicon(data.logo_url);
        }
        // Si no hay logo, no mostrar ningún favicon
      } catch (err) {
        console.error('Error loading organization data:', err);
        setError('Error loading organization data');
        // No fallar la aplicación si no se puede cargar la organización
        console.warn('Continuando sin datos de organización...');
      } finally {
        setLoading(false);
      }
    };

    // Cargar inmediatamente al montar el componente
    fetchOrganizationData();
  }, []);

        // Función para precargar el favicon
      const preloadFavicon = (logoUrl: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            FAVICON_CONFIG.updateFavicon(logoUrl);
            resolve(true);
          };
          img.onerror = () => {
            console.warn('No se pudo cargar el logo de la organización');
            reject(false);
          };
          img.src = logoUrl;
        });
      };

  return { organizationData, loading, error, updateFavicon: FAVICON_CONFIG.updateFavicon };
};
