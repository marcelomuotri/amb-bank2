import { supabase } from '../../supaconfig';

// Tipos para las respuestas
export interface BatchTransaction {
  id: number;
  batch_id: string;
  status: string;
  // Agregar otros campos según la respuesta real
}

export interface WebhookResponse {
  batch_id: string;
  status: string;
  message?: string;
}

// Función para hacer POST al webhook
export const uploadFilesToWebhook = async (
  files: File[], 
  client: string,
  bankName: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    
    // Agregar archivos con nombre parseado
    files.forEach(file => {
      // Crear nuevo nombre: "Banco - NombreOriginal.extensión"
      const fileExtension = file.name.split('.').pop();
      const fileNameWithoutExtension = file.name.replace(`.${fileExtension}`, '');
      const newFileName = `${bankName} - ${fileNameWithoutExtension}.${fileExtension}`;
      
      // Crear nuevo File con el nombre parseado
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append('file', renamedFile);
    });
    // Mockear el client momentáneamente para que siempre sea 1
    client = "1";
    // Agregar cliente
    formData.append('client_id', client);

    const response = await fetch(`https://ambolt-studio.up.railway.app/webhook/send-files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: WebhookResponse = await response.json();
    
    return result.batch_id;
    
  } catch (error) {
    console.error('Error subiendo archivos:', error);
    throw error;
  }
};

// Función para polling del batch
export const pollBatchStatus = async (batchId: string): Promise<BatchTransaction | null> => {
  try {
    const { data, error } = await supabase.rpc('get_batch_transactions', {
      batch_id_param: batchId
    });
    
    if (error) {
      console.error('Error polling batch:', error);
      throw error;
    }
    
    console.log('Estado del batch:', data);
    return data;
    
  } catch (error) {
    console.error('Error inesperado en polling:', error);
    throw error;
  }
};

// Función para verificar si el batch está completado
export const isBatchCompleted = (batchData: BatchTransaction | null): boolean => {
  if (!batchData) return false;
  
  // Solo verificar el estado "success"
  return batchData.status === 'success';
};

// Función para iniciar el proceso completo de polling
export const startBatchPolling = (
  batchId: string,
  onProgress: (message: string) => void,
  onComplete: (batchId: string) => void,
  onError: (error: string) => void,
  onTimeout: () => void
): (() => void) => {
  let pollCount = 0;
  const maxPolls = 20; // 5 minutos (20 * 15 segundos)
  
  const pollInterval = setInterval(async () => {
    pollCount++;
    
    try {
      const batchData = await pollBatchStatus(batchId);
      
      if (isBatchCompleted(batchData)) {
        clearInterval(pollInterval);
        onProgress('¡Proceso completado!');
        onComplete(batchId);
        return;
      }
      
      onProgress(`Procesando... (intento ${pollCount}/${maxPolls})`);
      
      // Timeout después de 20 intentos
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
        onTimeout();
      }
      
    } catch (error) {
      console.error('Error en polling:', error);
      onError(`Error en polling: ${error}`);
      clearInterval(pollInterval);
    }
  }, 15000); // 15 segundos
  
  // Retornar función para cancelar el polling
  return () => clearInterval(pollInterval);
};

// Función para obtener transacciones de un batch (para pruebas)
export const getBatchTransactions = async (batchId: string): Promise<BatchTransaction[]> => {
  try {
    const { data, error } = await supabase.rpc('get_batch_transactions', {
      batch_id_param: batchId
    });
    
    if (error) {
      throw error;
    }
    
    return Array.isArray(data) ? data : [data];
    
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    throw error;
  }
}; 