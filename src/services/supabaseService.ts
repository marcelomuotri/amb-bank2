import { supabase } from '../../supaconfig';
import { Client, Bank, Category, Subcategory, Entity } from '../types/supabaseTypes';

// Tipo para la tabla organizations
interface Organization {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

// Obtener el organization_id desde las variables de entorno
const ORGANIZATION_ID = import.meta.env.VITE_ORGANIZATION_ID || 'ec8b9ff0-1533-468d-93dd-2dd0deeb0188';

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

// Tipo para los datos de transacción del webhook
export interface WebhookTransaction {
  transaction_id: string;
  date: string;
  description: string;
  credit_amount: number | null;
  debit_amount: number | null;
  balance: number | null;
  subcategory: string;
  category: string;
  source: string;
  client_id: number;
}

// Tipo para la respuesta del webhook
export interface WebhookBatchResponse {
  status: string;
  data: WebhookTransaction[];
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
    //client = "1";
    // Agregar cliente
    formData.append('client_id', client);
    formData.append('organization_id', ORGANIZATION_ID);

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
  onComplete: (batchData: BatchTransaction | null) => void,
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
        onComplete(batchData);
        return batchData;
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

// Función para obtener todos los clientes de la tabla clients
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', ORGANIZATION_ID)
      .order('id', { ascending: true });
    if (error) throw error;
    return data as Client[];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}; 

// Función para obtener todos los bancos de la tabla banks
export const fetchBanks = async (): Promise<Bank[]> => {
  try {
    const { data, error } = await supabase
      .from('banks')
      .select('*');
    if (error) throw error;
    return data as Bank[];
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
}; 

// Función para actualizar una transacción específica
export const updateTransaction = async (
  transactionId: string,
  columnName: string,
  newValue: string | number
): Promise<boolean> => {
  console.log('transactionId', transactionId);
  
  // Mapeo de nombres de columnas de UI a nombres de base de datos
  const columnMapping: { [key: string]: string } = {
    'bank': 'source',
    'checkNumber': 'check_number',
    'observations': 'notes',
  };

  // Obtener el nombre real de la columna en la base de datos
  const dbColumnName = columnMapping[columnName] || columnName;
  
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ [dbColumnName]: newValue })
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error actualizando transacción:', error);
      throw error;
    }
    
    console.log('Transacción actualizada exitosamente:', { transactionId, columnName, dbColumnName, newValue });
    return true;
    
  } catch (error) {
    console.error('Error inesperado actualizando transacción:', error);
    throw error;
  }
};

// Función para eliminar una transacción específica
export const deleteTransaction = async (transactionId: string): Promise<boolean> => {
  console.log('Eliminando transacción:', transactionId);
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error eliminando transacción:', error);
      throw error;
    }
    
    console.log('Transacción eliminada exitosamente:', { transactionId });
    return true;
    
  } catch (error) {
    console.error('Error inesperado eliminando transacción:', error);
    throw error;
  }
};

// Función para eliminar múltiples transacciones
export const deleteMultipleTransactions = async (transactionIds: string[]): Promise<boolean> => {
  console.log('Eliminando transacciones:', transactionIds);
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .in('transaction_id', transactionIds);
    
    if (error) {
      console.error('Error eliminando transacciones:', error);
      throw error;
    }
    
    console.log('Transacciones eliminadas exitosamente:', { transactionIds });
    return true;
    
  } catch (error) {
    console.error('Error inesperado eliminando transacciones:', error);
    throw error;
  }
};

// Función para actualizar múltiples transacciones en bulk
export const updateMultipleTransactions = async (
  transactionIds: string[],
  updates: { [key: string]: string | number }
): Promise<boolean> => {
  console.log('Actualizando transacciones en bulk:', { transactionIds, updates });
  
  // Mapeo de nombres de columnas de UI a nombres de base de datos
  const columnMapping: { [key: string]: string } = {
    'bank': 'source',
    'checkNumber': 'check_number',
    'observations': 'notes',
  };

  // Aplicar mapeo a las actualizaciones
  const mappedUpdates: { [key: string]: string | number } = {};
  Object.keys(updates).forEach(key => {
    const dbColumnName = columnMapping[key] || key;
    mappedUpdates[dbColumnName] = updates[key];
  });
  
  try {
    const { error } = await supabase
      .from('transactions')
      .update(mappedUpdates)
      .in('transaction_id', transactionIds);
    
    if (error) {
      console.error('Error actualizando transacciones en bulk:', error);
      throw error;
    }
    
    console.log('Transacciones actualizadas exitosamente en bulk:', { transactionIds, updates, mappedUpdates });
    return true;
    
  } catch (error) {
    console.error('Error inesperado actualizando transacciones en bulk:', error);
    throw error;
  }
};

// Función para buscar transacciones por cliente
export const searchTransactionsByClient = async (clientId: number): Promise<any[]> => {
  console.log('Buscando transacciones para cliente:', clientId);
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error buscando transacciones:', error);
      throw error;
    }
    
    console.log('Transacciones encontradas:', data?.length || 0);
    return data || [];
    
  } catch (error) {
    console.error('Error inesperado buscando transacciones:', error);
    throw error;
  }
}; 

// Función para obtener todas las categorías de la tabla categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .eq('organization_id', ORGANIZATION_ID);
    if (error) throw error;
    return data as Category[] || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}; 

// Función para obtener todas las subcategorías de la tabla subcategories
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const { data, error } = await supabase
      .from('subcategory')
      .select('*')
      .eq('organization_id', ORGANIZATION_ID);
    if (error) throw error;
    return data as Subcategory[] || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
}; 

// Función para crear un nuevo cliente
export const createClient = async (clientData: {
  name: string;
  ein: string;
  industry: string;
}): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData,
        organization_id: ORGANIZATION_ID
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Client;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Función para crear una entity
export const createEntity = async (entityData: {
  name: string;
  keywords: string[];
  type: string;
  client_id: number;
}): Promise<Entity> => {
  try {
    const { data, error } = await supabase
      .from('entities')
      .insert({
        name: entityData.name,
        keywords: entityData.keywords,
        type: entityData.type,
        client_id: entityData.client_id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
    
    console.log('Entity created successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error creating entity:', error);
    throw error;
  }
};

// Función para crear múltiples entities
export const createMultipleEntities = async (entitiesData: {
  name: string;
  keywords: string[];
  type: string;
  client_id: number;
}[]): Promise<Entity[]> => {
  try {
    const entitiesToInsert = entitiesData.map(entity => ({
      name: entity.name,
      keywords: entity.keywords,
      type: entity.type,
      client_id: entity.client_id,
    }));

    const { data, error } = await supabase
      .from('entities')
      .insert(entitiesToInsert)
      .select();
    
    if (error) {
      console.error('Error creating multiple entities:', error);
      throw error;
    }
    
    console.log('Multiple entities created successfully:', data);
    return data as Entity[];
  } catch (error) {
    console.error('Unexpected error creating multiple entities:', error);
    throw error;
  }
}; 

// Función para eliminar un cliente
export const deleteClient = async (clientId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
    
    console.log('Client deleted successfully:', { clientId });
    return true;
    
  } catch (error) {
    console.error('Unexpected error deleting client:', error);
    throw error;
  }
}; 

// Función para obtener un cliente específico por ID
export const fetchClientById = async (clientId: number): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching client:', error);
    throw error;
  }
};

// Función para actualizar un cliente
export const updateClient = async (clientId: number, updates: {
  name: string;
  ein: string;
  industry: string;
}): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: updates.name,
        ein: updates.ein,
        industry: updates.industry,
      })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    
    console.log('Client updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error updating client:', error);
    throw error;
  }
}; 

// Función para obtener entities por client_id
export const fetchEntitiesByClientId = async (clientId: number): Promise<Entity[]> => {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
    
    console.log('Entities fetched for client:', clientId, data);
    return data as Entity[];
  } catch (error) {
    console.error('Unexpected error fetching entities:', error);
    throw error;
  }
}; 

// Función para eliminar todas las entities de un cliente
export const deleteEntitiesByClientId = async (clientId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('entities')
      .delete()
      .eq('client_id', clientId);
    
    if (error) {
      console.error('Error deleting entities:', error);
      throw error;
    }
    
    console.log('All entities deleted for client:', clientId);
    return true;
  } catch (error) {
    console.error('Unexpected error deleting entities:', error);
    throw error;
  }
};

// Función para obtener los valores del enum industry
export const fetchIndustryOptions = async (): Promise<string[]> => {
  try {
    // Consulta SQL raw para obtener todos los valores posibles del enum
    const { data, error } = await supabase
      .rpc('get_enum_values', { enum_name: 'industry' });
    
    if (error) {
      console.error('Error fetching industry enum values:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching industry options:', error);
    throw error;
  }
};

// Función para obtener los valores del enum entity_type
export const fetchEntityTypeOptions = async (): Promise<string[]> => {
  try {
    // Consulta SQL raw para obtener todos los valores posibles del enum
    const { data, error } = await supabase
      .rpc('get_enum_values', { enum_name: 'entity_type' });
    
    if (error) {
      console.error('Error fetching entity_type enum values:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching entity_type options:', error);
    throw error;
  }
};

// Función para obtener los datos de la organización
export const getOrganizationData = async (): Promise<Organization> => {
  try {
    console.log('Buscando organización con ID:', ORGANIZATION_ID);
    
    // Primero, vamos a ver qué organizaciones existen
    const { data: allOrgs, error: listError } = await supabase
      .from('organizations')
      .select('id, name');
    
    if (listError) {
      console.error('Error listando organizaciones:', listError);
    } else {
      console.log('Organizaciones disponibles:', allOrgs);
    }
    
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', ORGANIZATION_ID)
      .single();
    
    if (error) {
      console.error('Error fetching organization data:', error);
      throw error;
    }
    
    console.log('Organization data:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching organization data:', error);
    throw error;
  }
};

// Función para obtener el dashboard de archivos
export const getFilesDashboard = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('get_files_dashboard', {
      org_id: ORGANIZATION_ID
    });
    
    if (error) {
      console.error('Error fetching files dashboard:', error);
      throw error;
    }
    
    console.log('Files dashboard response:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching files dashboard:', error);
    throw error;
  }
}; 