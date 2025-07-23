// Tipos para la tabla clients de Supabase
export interface Client {
  id: number;
  name: string;
  created_at: string; // ISO date string
  organization_id: string;
}

export interface supaBank {
  id: number;
  name: string;
  created_at: string;
  organization_id: string;
} 

export interface Bank {
  label: string;
  value: string;
}