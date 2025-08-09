// Configuración del favicon
export const FAVICON_CONFIG = {
  // Favicon por defecto (más neutral)
  DEFAULT_FAVICON: '/favicon.svg',
  
  // Función para actualizar el favicon
  updateFavicon: (logoUrl: string) => {
    try {
      // Remover favicon existente
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Crear nuevo favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/x-icon';
      favicon.href = logoUrl;
      
      // Agregar al head
      document.head.appendChild(favicon);
      
      console.log('Favicon updated with organization logo:', logoUrl);
    } catch (error) {
      console.error('Error updating favicon:', error);
    }
  },

  // Función para restaurar favicon por defecto
  restoreDefaultFavicon: () => {
    try {
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.remove();
      }

      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/x-icon';
      favicon.href = FAVICON_CONFIG.DEFAULT_FAVICON;
      
      document.head.appendChild(favicon);
    } catch (error) {
      console.error('Error restoring default favicon:', error);
    }
  }
};
