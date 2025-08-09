// Configuración de variables de entorno
export const config = {
  // Organization ID - usar variable de entorno o valor por defecto
  ORGANIZATION_ID: import.meta.env.VITE_ORGANIZATION_ID || 'ec8b9ff0-1533-468d-93dd-2dd0deeb0188',
} as const;

// Exportar directamente para uso más fácil
export const ORGANIZATION_ID = config.ORGANIZATION_ID;
